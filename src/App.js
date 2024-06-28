import React, { Suspense, lazy } from "react";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import { useCurrentUser } from "./contexts/CurrentUserContext";

const SignUpForm = lazy(() => import("./pages/auth/SignUpForm"));
const SignInForm = lazy(() => import("./pages/auth/SignInForm"));
const PostCreateForm = lazy(() => import("./pages/posts/PostCreateForm"));
const PostPage = lazy(() => import("./pages/posts/PostPage"));
const PostsPage = lazy(() => import("./pages/posts/PostsPage"));
const PostEditForm = lazy(() => import("./pages/posts/PostEditForm"));
const ProfilePage = lazy(() => import("./pages/profiles/ProfilePage"));
const UsernameForm = lazy(() => import("./pages/profiles/UsernameForm"));
const UserPasswordForm = lazy(() => import("./pages/profiles/UserPasswordForm"));
const ProfileEditForm = lazy(() => import("./pages/profiles/ProfileEditForm"));
const ChannelsPage = lazy(() => import("./pages/channels/ChannelsPage"));
const ChannelCreateForm = lazy(() => import("./pages/channels/ChannelCreateForm"));
const ChannelEditForm = lazy(() => import("./pages/channels/ChannelEditForm"));

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <PostsPage message="No results found. Adjust the search keyword." />
              )}
            />
            <Route
              exact
              path="/feed"
              render={() => (
                <PostsPage
                  message="No results found. Adjust the search keyword or follow a user."
                  filter={`owner__followed__owner__profile=${profile_id}&`}
                />
              )}
            />
            <Route
              exact
              path="/liked"
              render={() => (
                <PostsPage
                  message="No results found. Adjust the search keyword or like a post."
                  filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
                />
              )}
            />
            <Route
              exact
              path="/channels/followed"
              render={() => (
                <ChannelsPage
                  message="No followed channels found."
                  filter="followed/"
                />
              )}
            />
            <Route exact path="/signin" render={() => <SignInForm />} />
            <Route exact path="/signup" render={() => <SignUpForm />} />
            <Route exact path="/posts/create" render={() => <PostCreateForm />} />
            <Route exact path="/posts/:id" render={() => <PostPage />} />
            <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
            <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
            <Route
              exact
              path="/channel/create"
              render={() => <ChannelCreateForm />}
            />
            <Route exact path="/channels/:title" component={ChannelsPage} />
            <Route
              exact
              path="/profiles/:id/edit/username"
              render={() => <UsernameForm />}
            />
            <Route
              exact
              path="/profiles/:id/edit/password"
              render={() => <UserPasswordForm />}
            />
            <Route
              exact
              path="/profiles/:id/edit"
              render={() => <ProfileEditForm />}
            />
            <Route
              exact
              path="/channels/:title/edit"
              render={({ match }) => (
                <ChannelEditForm title={match.params.title} />
              )}
            />
            <Route render={() => <p>Page not found!</p>} />
          </Switch>
        </Suspense>
      </Container>
    </div>
  );
}

export default App;
