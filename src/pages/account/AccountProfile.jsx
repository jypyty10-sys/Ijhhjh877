import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import { formatDate } from '../../lib/format.js';

export default function AccountProfile() {
  const { user, setUser, pushToast } = useStore();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get('/account/profile')
      .then((data) => {
        setProfile({
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          email: data.profile.email,
          phone: data.profile.phone || '',
        });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const data = await api.put('/account/profile', profile);
      pushToast(data.message || 'Your details have been saved.');
      setUser((current) => ({
        ...current,
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        email: data.profile.email,
        phone: data.profile.phone,
      }));
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setPasswordError('');
    if (passwords.newPassword !== passwords.confirm) {
      setPasswordError('The new passwords do not match.');
      return;
    }
    setPasswordBusy(true);
    try {
      const data = await api.post('/account/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      pushToast(data.message || 'Password updated.');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setPasswordBusy(false);
    }
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl">Profile Settings</h2>
        <p className="mt-1 text-[11px] text-charcoal/55">
          Member since {formatDate(user?.createdAt)}
        </p>

        <form onSubmit={saveProfile} className="mt-5 max-w-xl space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="pf-first">
                First name
              </label>
              <input
                id="pf-first"
                className="field"
                value={profile.firstName}
                onChange={(event) => setProfile((c) => ({ ...c, firstName: event.target.value }))}
                disabled={!loaded}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="pf-last">
                Last name
              </label>
              <input
                id="pf-last"
                className="field"
                value={profile.lastName}
                onChange={(event) => setProfile((c) => ({ ...c, lastName: event.target.value }))}
                disabled={!loaded}
              />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="pf-email">
              Email
            </label>
            <input
              id="pf-email"
              type="email"
              className="field"
              value={profile.email}
              onChange={(event) => setProfile((c) => ({ ...c, email: event.target.value }))}
              disabled={!loaded}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="pf-phone">
              Phone
            </label>
            <input
              id="pf-phone"
              className="field"
              value={profile.phone}
              onChange={(event) => setProfile((c) => ({ ...c, phone: event.target.value }))}
              disabled={!loaded}
            />
          </div>
          <button type="submit" disabled={busy || !loaded} className="btn-dark">
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>

      <section className="border-t border-ink/10 pt-8">
        <h2 className="font-display text-xl">Password</h2>
        <p className="mt-1 text-[11px] text-charcoal/55">Choose something long and difficult to guess.</p>

        <form onSubmit={savePassword} className="mt-5 max-w-xl space-y-4">
          <div>
            <label className="field-label" htmlFor="pw-current">
              Current password
            </label>
            <input
              id="pw-current"
              type="password"
              className="field"
              value={passwords.currentPassword}
              onChange={(event) => setPasswords((c) => ({ ...c, currentPassword: event.target.value }))}
              autoComplete="current-password"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="pw-new">
                New password
              </label>
              <input
                id="pw-new"
                type="password"
                className="field"
                value={passwords.newPassword}
                onChange={(event) => setPasswords((c) => ({ ...c, newPassword: event.target.value }))}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="pw-confirm">
                Confirm new password
              </label>
              <input
                id="pw-confirm"
                type="password"
                className="field"
                value={passwords.confirm}
                onChange={(event) => setPasswords((c) => ({ ...c, confirm: event.target.value }))}
                autoComplete="new-password"
              />
            </div>
          </div>
          {passwordError ? <p className="text-[11px] text-[#b4523f]">{passwordError}</p> : null}
          <button type="submit" disabled={passwordBusy} className="btn-light">
            {passwordBusy ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>
    </div>
  );
}
