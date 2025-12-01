import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  draftCourses: [],
  tempCourse: null,
  isLoading: false,
  singleCourseDetail: null,
  currentEnrolledCourse:null
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setTempCourse(state, action) {
      state.tempCourse = action.payload;
    },
    setDraftCourses(state, action) {
      state.draftCourses = action.payload;
    },
    setSingleCourseDetail(state, action) {
      state.singleCourseDetail = action.payload;
    },
    setEnrolledCourse(state, action) {
      state.currentEnrolledCourse = action.payload;
    },
  },
});

export const { setTempCourse, setDraftCourses,setSingleCourseDetail,setEnrolledCourse } = courseSlice.actions;
export default courseSlice.reducer;
