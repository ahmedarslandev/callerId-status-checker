import { Action, actionTypes } from "@/types/myfiles.reducer.types";

  export const initialState = {
    files: null,
    copiedFiles: null,
    isRefreshing: false,
    selectedSort: "size",
    search: "",
    filterSelected: "realname",
    currentPage: 1,
    filesAtOnePage: 12,
    totalPages: 1,
  };

 export const reducer = (state: any, action: Action) => {
    switch (action.type) {
      case actionTypes.SET_FILES:
        return { ...state, files: [...action.payload] };
      case actionTypes.SET_COPIED_FILES:
        return { ...state, copiedFiles: action.payload };
      case actionTypes.SET_REFRESHING:
        return { ...state, isRefreshing: action.payload };
      case actionTypes.SET_SORT:
        return { ...state, selectedSort: action.payload };
      case actionTypes.SET_SEARCH:
        return { ...state, search: action.payload };
      case actionTypes.SET_FILTER:
        return { ...state, filterSelected: action.payload };
      case actionTypes.SET_CURRENT_PAGE:
        return { ...state, currentPage: action.payload };
      case actionTypes.SET_TOTAL_PAGES:
        return { ...state, totalPages: action.payload };
      default:
        return state;
    }
  };


  