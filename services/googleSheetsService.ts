import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If logged in but no token yet, we can try to re-auth or wait
        // In firebase client SDK, silent token refresh can be done, but since scope token
        // is acquired via credentialFromResult during signInWithPopup, if we refresh page 
        // cachedAccessToken is cleared. We'll handle this gracefully by prompting login if needed.
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Google Drive API helper to get or create Spreadsheet
async function getOrCreateSpreadsheetId(accessToken: string, name: string): Promise<string> {
  const query = encodeURIComponent(`name = '${name}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
  
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Failed to search spreadsheet: ${err.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  
  // Create new spreadsheet
  const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.spreadsheet'
    })
  });
  
  if (!createResponse.ok) {
    const err = await createResponse.json().catch(() => ({}));
    throw new Error(`Failed to create spreadsheet: ${err.error?.message || createResponse.statusText}`);
  }
  
  const createdData = await createResponse.json();
  return createdData.id;
}

// Google Sheets API helper to check or create worksheet tab
async function ensureWorksheetExists(accessToken: string, spreadsheetId: string, sheetTitle: string): Promise<void> {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Failed to read spreadsheet metadata: ${err.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  const sheets = data.sheets || [];
  const exists = sheets.some((s: any) => s.properties?.title === sheetTitle);
  
  if (!exists) {
    // Add new sheet (tab)
    const addResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetTitle
              }
            }
          }
        ]
      })
    });
    
    if (!addResponse.ok) {
      const err = await addResponse.json().catch(() => ({}));
      throw new Error(`Failed to create sheet tab: ${err.error?.message || addResponse.statusText}`);
    }
  }
}

// Google Sheets API helper to append rows
async function appendRow(accessToken: string, spreadsheetId: string, sheetTitle: string, values: any[][]) {
  const range = `${encodeURIComponent(sheetTitle)}!A1`;
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values
    })
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Failed to append data: ${err.error?.message || response.statusText}`);
  }
}

// Google Sheets API helper to ensure headers exist
async function ensureHeaders(accessToken: string, spreadsheetId: string, sheetTitle: string) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:B1`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Failed to check headers: ${err.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  if (!data.values || data.values.length === 0) {
    // Write headers
    const headers = [
      "Timestamp", "Name", "Position", "Unit", "Assessor Name", "Experience (Years)", 
      "Score", "Total Questions", "Compliance (%)", "Wrong Answers", "Points", "Badges", "Assessment Type"
    ];
    await appendRow(accessToken, spreadsheetId, sheetTitle, [headers]);
  }
}

export interface SaveAssessmentData {
  userName: string;
  position: string;
  unit: string;
  testerName: string;
  experience: string | number;
  score: number;
  totalQuestions: number;
  complianceRate: number;
  wrongAnswers: string[];
  points: number;
  badges: string;
  isSelf: boolean;
}

// Save Assessment to Google Sheets (Identify google sheets -> self assessment)
export const saveAssessmentToGoogleSheet = async (
  accessToken: string,
  assessment: SaveAssessmentData
): Promise<void> => {
  const SPREADSHEET_NAME = "Identify google sheets";
  const SHEET_NAME = "self assessment";
  
  // 1. Get or create the Spreadsheet ID
  const spreadsheetId = await getOrCreateSpreadsheetId(accessToken, SPREADSHEET_NAME);
  
  // 2. Ensure "self assessment" tab/sheet exists
  await ensureWorksheetExists(accessToken, spreadsheetId, SHEET_NAME);
  
  // 3. Ensure the tab contains the correct headers
  await ensureHeaders(accessToken, spreadsheetId, SHEET_NAME);
  
  // 4. Prepare data row
  const timestamp = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  const wrongAnswersText = assessment.wrongAnswers && assessment.wrongAnswers.length > 0 
    ? assessment.wrongAnswers.join('\n') 
    : 'ไม่มี';
  
  const rowData = [
    timestamp,
    assessment.userName,
    assessment.position,
    assessment.unit,
    assessment.testerName || 'ประเมินตนเอง',
    assessment.experience,
    assessment.score,
    assessment.totalQuestions,
    `${assessment.complianceRate}%`,
    wrongAnswersText,
    assessment.points,
    assessment.badges || 'ไม่มี',
    assessment.isSelf ? 'ประเมินตนเอง' : 'ประเมินโดยผู้อื่น (Peer)'
  ];
  
  // 5. Append data row
  await appendRow(accessToken, spreadsheetId, SHEET_NAME, [rowData]);
};
