import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "./components/PageLoader";
import { SiteLayout } from "./components/SiteLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage"));
const OpenSourcePage = lazy(() => import("./pages/OpenSourcePage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/work/:projectSlug" element={<CaseStudyPage />} />
          <Route path="/open-source" element={<OpenSourcePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
