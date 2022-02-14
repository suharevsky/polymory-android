import firebase from 'firebase/app';
import 'firebase/app-check';

// Environment Config
import {environment} from 'src/environments/environment';

const app = firebase.initializeApp(environment.firebase);
const appCheck = app.appCheck()
appCheck.activate('6Le5sSseAAAAAOT8roZmRnHRYTqsyQhyu_3AFsh3');