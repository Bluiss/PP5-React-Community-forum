import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { ProfileDataProvider } from "./contexts/ProfileDataContext";
import { ChannelDataProvider } from "./contexts/ChannelDataContext";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";

test("renders sign in link", () => {
  render(
    <Router>
      <CurrentUserProvider>
        <ProfileDataProvider>
          <ChannelDataProvider>
            <App />
          </ChannelDataProvider>
        </ProfileDataProvider>
      </CurrentUserProvider>
    </Router>
  );

  const signInLink = screen.getByLabelText("Sign In");
  expect(signInLink).toBeInTheDocument();
});
