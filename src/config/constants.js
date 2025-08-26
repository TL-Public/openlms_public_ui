export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const QMS_URL = import.meta.env.VITE_QMS_URL;
export const QMS_FE_URL = import.meta.env.VITE_QMS_FE_URL;
export const HOST_URL = import.meta.env.VITE_HOST_URL;
export const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;    
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export const String_Constants = {
	ALL_COURSES: 'All Courses',
	ALL_COURSES_HI:'सभी पाठ्यक्रम',
	ALL_STATES: 'All States',
	ALL_STATES_HI:'सभी राज्य',
	ALL_YEARS: 'All Years',
	NO_COURSE_FOUND: 'courses not found',
	NO_STATE_FOUND: 'states not found'
};

export const Sorting_Orders = {
	ASCENDING: 'ascending',
	DESCENDING: 'descending'
};

export const languageMap = {
	en: 'English',
	hi: 'Hindi',
	ta: 'Tamil',
	ml: 'Malayalam',
	bn: 'Bengali',
	mr: 'Marathi',
	te: 'Telugu',
	gu: 'Gujarati',
	kn: 'Kannada',
	or: 'Odia',
	pa: 'Punjabi',
	as: 'Assamese'
};

export let languageArray = [
  { id: 1,  name: 'English',  code: 'en' },
  { id: 2,  name: 'Hindi',    code: 'hi' },
  { id: 3,  name: 'Tamil',    code: 'ta' },
  { id: 4,  name: 'Malayalam',code: 'ml' },
  { id: 5,  name: 'Bengali',  code: 'bn' },
  { id: 6,  name: 'Marathi',  code: 'mr' },
  { id: 7,  name: 'Telugu',   code: 'te' },
  { id: 8,  name: 'Gujarati', code: 'gu' },
  { id: 9,  name: 'Kannada',  code: 'kn' },
  { id: 10, name: 'Odia',     code: 'or' },
  { id: 11, name: 'Punjabi',  code: 'pa' },
  { id: 12, name: 'Assamese', code: 'as' }
];


export let languageOrder =  [
	'en',
	'hi',
	'as',
	'bn',
	'gu',
	'kn',
	'ml',
	'mr',
	'or',
	'pa',
	'ta',
	'te'
]

export const public_user_info = {
	email: 'public@reaplearn.in',
	displayName: 'public'
};

export const Course_Sorting_Order = {
	TITLE_A_TO_Z: 'TITLE_A_TO_Z',
	TITLE_Z_TO_A: 'TITLE_Z_TO_A',
	DURATION_LOW_TO_HIGH: 'DURATION_LOW_TO_HIGH',
	DURATION_HIGH_TO_LOW: 'DURATION_HIGH_TO_LOW',
	CHAPTERCNT_LOW_TO_HIGH: 'CHAPTERCNT_LOW_TO_HIGH',
	CHAPTERCNT_HIGH_TO_LOW: 'CHAPTERCNT_HIGH_TO_LOW',
	PLANNED_DATE_LOW_TO_HIGH: 'PLANNED_DATE_LOW_TO_HIGH',
	PLANNED_DATE_HIGH_TO_LOW: 'PLANNED_DATE_HIGH_TO_LOW',
	PLANNED_COURSES_LOW_TO_HIGH: 'PLANNED_COURSES_LOW_TO_HIGH',
	PLANNED_COURSES_HIGH_TO_LOW: 'PLANNED_COURSES_HIGH_TO_LOW'
};
