import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "./features/auth/pages/login-page";
import { RegisterPage } from "./features/auth/pages/register-page";
import { CourseDetailsPage } from "./features/courses/pages/course-details-page";
import { CoursesDashboardPage } from "./features/courses/pages/courses-dashboard-page";
import { AuthenticatedLayout } from "./shared/components/authenticated-layout";
import { ProtectedRoute } from "./shared/components/protected-route";
import { PublicRoute } from "./shared/components/public-route";

export function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route element={<CoursesDashboardPage />} path="/dashboard" />
          <Route element={<CourseDetailsPage />} path="/courses/:courseId" />
        </Route>
      </Route>

      <Route element={<Navigate replace to="/dashboard" />} path="/" />
      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  );
}
