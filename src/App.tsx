import { Route, Routes } from 'react-router-dom';
import { ContentProvider } from './lib/content';
import { LanguageProvider } from './lib/i18n';
import { LeadProvider } from './lib/lead';
import { Landing } from './pages/Landing';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <LeadProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </LeadProvider>
      </ContentProvider>
    </LanguageProvider>
  );
}
