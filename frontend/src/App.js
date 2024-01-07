import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { ShelterSignup } from "./pages/signups/ShelterSignup";
import { UserSignup } from "./pages/signups/UserSignup";
import { ShelterProfile } from "./pages/profiles/ShelterProfile";
import { UserProfile } from "./pages/profiles/UserProfile";
import { UserShelterList } from "./pages/ShelterList/UserShelterList";
import { ShelterShelterList } from "./pages/ShelterList/ShelterShelterList";
import { UserShelterView } from "./pages/viewshelter/UserViewShelter";
import { ShelterShelterView } from "./pages/viewshelter/ShelterViewShelter";
import {ViewListing} from "./pages/listings/ViewListing";
import {ListingList} from "./pages/listings/ListingList";
import { UserApplication } from "./pages/applications/UserApplication";
import { UserApplicationList } from "./pages/applications/UserApplicationList";
import {CreateListing} from "./pages/listings/CreateListing";
import {EditListing} from "./pages/listings/EditListing";
import {MyListings} from "./pages/listings/MyListings";
import { UserApplicationView } from "./pages/applications/UserApplicationView";
import { ShelterApplicationList } from "./pages/applications/ShelterApplicationList";
import { ShelterApplicationView } from "./pages/applications/ShelterApplicationView";
import { ShelterCreateBlog } from "./pages/blog/ShelterCreateBlog";
import { ShelterPreviewBlog } from "./pages/blog/ShelterPreviewBlog";
import { ShelterListBlog } from "./pages/blog/ShelterListBlog";
import { ShelterViewBlog } from "./pages/blog/ShelterViewBlog";
import { UserListBlog } from "./pages/blog/UserListBlog";
import { UserViewBlog } from "./pages/blog/UserViewBlog";
import { UserDelete } from "./pages/profiles/UserDelete";
import { ShelterDelete } from "./pages/profiles/ShelterDelete";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shelter/signup" element={<ShelterSignup />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/shelter/profile" element={<ShelterProfile />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/shelter/list" element={<ShelterShelterList />} />
          <Route path="/user/list" element={<UserShelterList />} />
          <Route path="/user/shelterview/:id" element={<UserShelterView />} />
          <Route path="/shelter/shelterview/:id" element={<ShelterShelterView />} />
          <Route path="/user/application/:id" element={<UserApplication/>} />
          <Route path="/user/application/view/:id" element={<UserApplicationView/>} />
          <Route path="/shelter/application/view/:id" element={<ShelterApplicationView/>} />
          <Route path="/user/application/list" element={<UserApplicationList/>} />
          <Route path="/shelter/application/list" element={<ShelterApplicationList/>} />
          <Route path="/listing/:id" element={<ViewListing />} />
          <Route path="/listings" element={<ListingList />} />
          <Route path="/listings/create" element={<CreateListing />} />
          <Route path="/listings/edit/:id" element={<EditListing />} />
          <Route path="/shelter/mylistings" element={<MyListings />} />
          <Route path="/blog/create" element={<ShelterCreateBlog />} />
          <Route path="/blog/preview" element={<ShelterPreviewBlog />} />
          <Route path="/shelter/blogs" element={<ShelterListBlog />} />
          <Route path="/shelter/blog/:id" element={<ShelterViewBlog />} />
          <Route path="/user/blogs" element={<UserListBlog />} />
          <Route path="/user/blog/:id" element={<UserViewBlog />} />
          <Route path="/user/delete" element={<UserDelete />} />
          <Route path="/shelter/delete" element={<ShelterDelete />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
