import { combineReducers } from "redux";
import layout from "./layout";
import contacts from "./contacts";
import {auth} from "../everest/redux/auth";

export default combineReducers({
    layout,
    contacts,
    auth
});
