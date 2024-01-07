import {header} from "../PublicComponents/header";
import {sidebar} from "../PublicComponents/shelter_sidebar";
import {form} from "./subcomponents/createform";
import { baseURL } from "../../urlConfig";

export function CreateListing() {
    return (<div className="outerbox">
        {header()}
        {sidebar()}
        <div className="content-box">
            {form()}
        </div>
    </div> )
}