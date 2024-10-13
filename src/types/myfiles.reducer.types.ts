export const actionTypes = {
    SET_FILES: "SET_FILES",
    SET_COPIED_FILES: "SET_COPIED_FILES",
    SET_REFRESHING: "SET_REFRESHING",
    SET_SORT: "SET_SORT",
    SET_SEARCH: "SET_SEARCH",
    SET_FILTER: "SET_FILTER",
    SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
    SET_TOTAL_PAGES: "SET_TOTAL_PAGES",
  };
  
  // Action interface
  export interface Action {
    type: string;
    payload: any;
  }
  