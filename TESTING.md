# Unit & Integration Testing - Frontend

## Setup

Testing menggunakan **Vitest**, **React Testing Library**, **Redux Toolkit**, **TanStack Query**, dan **Tailwind CSS**.

### Dependencies
```bash
npm install --save-dev vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Configuration

- `vite.config.ts` - Ditambahkan properti `test` dan plugin `@tailwindcss/vite`.
- `src/test/setup.ts` - Konfigurasi global `@testing-library/jest-dom`.
- `src/store/` - Management state terpusat.
- `src/hooks/api/` - Logic pemanggilan API menggunakan TanStack Query.

---

## Running Tests

```bash
# Jalankan semua tes sekali
npm test -- --run

# Jalankan tes dalam mode interaktif (watch mode)
npm test

# Laporan coverage
npm run test:coverage

# UI mode (vitest)
npm run test:ui
```

---

## Test Files

```
frontend/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Button.test.tsx      # Unit test Button component
│   │       └── Input.test.tsx       # Unit test Input component
│   └── pages/
│       ├── auth/
│       │   ├── LoginPage.test.tsx   # Integration test Halaman Login
│       │   └── RegisterPage.test.tsx# Integration test Halaman Register
│       └── dashboard/
│           └── PetambakDashboard.test.tsx # Integration test Dashboard
```

---

## Test Coverage Summary

| File | Tests | Deskripsi |
|------|-------|-----------|
| `Button.test.tsx` | 4 | Render children, event click, state disabled, custom class |
| `Input.test.tsx` | 4 | Render label, error message, event change, password type |
| `LoginPage.test.tsx` | 5 | Form render, role switch, input update, login success (mock), login failure |
| `RegisterPage.test.tsx` | 4 | Form render, dynamic fields by role, registration success, password mismatch |
| `PetambakDashboard.test.tsx`| 4 | Render data (tambak, batch, wallet, orders), tab switching, modal state |
| **TOTAL** | **21** | **Semua PASSED ✓** |

---

## Best Practices (Frontend)

1. **Accessibility-based Selectors**: Gunakan `getByRole`, `getByLabelText`, `getByPlaceholderText` untuk memastikan komponen aksesibel.
2. **Mocking Services & API**: Gunakan `vi.mock` untuk mengisolasi komponen dari API backend yang sesungguhnya.
3. **Context Provider Mocking**: Bungkus komponen dengan `BrowserRouter` atau provider lain yang dibutuhkan saat testing.
4. **Testing User Behavior**: Gunakan `fireEvent` atau `userEvent` untuk mensimulasikan interaksi pengguna.
5. **Wait for Updates**: Gunakan `waitFor` untuk menangani perubahan state asynchronous (misal setelah API call).

---

## Example Test Component

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { it, expect, vi } from 'vitest';

it('handles click', () => {
  const fn = vi.fn();
  render(<Button onClick={fn}>Click</Button>);
  fireEvent.click(screen.getByText('Click'));
  expect(fn).toHaveBeenCalled();
});
```
