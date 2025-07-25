# OnlyTests Test Automation Framework

A modern, simplified test automation framework built with Playwright and TypeScript, focusing on maintainability and ease of use.

## 🚀 Features

- **UI Testing**: Simplified Page Object Model with Playwright
- **TypeScript**: Full type safety and IntelliSense support
- **Environment Management**: Multi-environment configuration
- **Reporting**: HTML reports with screenshots and videos
- **CI/CD Ready**: GitHub Actions integration
- **Code Quality**: ESLint and TypeScript configuration

## 📁 Project Structure

```
├── src/
│   ├── config/
│   │   └── environment.ts          # Environment configuration
│   ├── core/
│   │   ├── interfaces.ts           # Essential interfaces
│   │   ├── page.factory.ts         # Page factory
│   │   └── test-base.ts            # Test fixtures
│   ├── pages/
│   │   ├── base-page.ts            # Base page object
│   │   ├── home-page.ts            # Home page
│   │   ├── about-page.ts           # About page
│   │   ├── tools-page.ts           # Tools page
│   │   ├── tools
│   │   └── templates
│   ├── setup/
│   │   └── test-setup.ts           # Test setup utilities
│   └── utils/
│       ├── config-validator.ts     # Configuration validation
│       ├── logger.ts               # Logging utilities
│       └── test-utils.ts           # Common test utilities
├── tests/
│   └── ui/
│       ├── basic-functionality.spec.ts
│       ├── home.spec.ts
│       ├── navigation.spec.ts
│       ├── tools.spec.ts
│       ├── tools
│       └── templates
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── eslint.config.mjs               # ESLint configuration
├── package.json                    # Dependencies and scripts
└── README.md                      # This file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd onlytests_test_automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

## 🧪 Running Tests

### All Tests
```bash
npm test
```

### UI Tests Only
```bash
npx playwright test tests/ui/
```

### Specific Test File
```bash
npx playwright test tests/ui/home.spec.ts
```

### Headed Mode (with browser UI)
```bash
npx playwright test --headed
```

### Debug Mode
```bash
npx playwright test --debug
```

### Generate Test Code
```bash
npx playwright codegen
```

## 📊 Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Reports are generated in:
- `playwright-report/` - HTML report
- `test-results/screenshots/` - Screenshots on failure
- `test-results/videos/` - Video recordings

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
NODE_ENV=development
DEV_BASE_URL=https://onlytests.io
DEV_API_URL=https://onlytests.io/api
TIMEOUT=30000
RETRIES=2
HEADLESS=true
```

### Playwright Configuration

The framework supports multiple browsers and environments. Edit `playwright.config.ts` to customize:

- Browser configurations
- Test timeouts
- Screenshot and video settings
- Parallel execution settings

## 📝 Writing Tests

### Page Objects

Create page objects extending `BasePage`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from '../pages/base-page';

export class HomePage extends BasePage {
  private get welcomeMessage() { 
    return this.page.locator('.welcome-message'); 
  }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async navigate(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/`);
    await this.waitForPageLoad();
  }

  async getWelcomeMessage(): Promise<string> {
    return await this.welcomeMessage.textContent() || '';
  }
}
```

### Writing Tests

Write tests using page objects:

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/home-page';
import { env } from '../../src/config/environment';

test('should display welcome message', async ({ page }) => {
  const homePage = new HomePage(page, env.getBaseUrl());
  await homePage.navigate();
  
  const message = await homePage.getWelcomeMessage();
  expect(message).toContain('Welcome');
});
```

### Using Test Fixtures

The framework provides test fixtures for common pages:

```typescript
import { test, expect } from '../../src/core/test-base';

test('should navigate to home page', async ({ homePage }) => {
  await homePage.navigate();
  const title = await homePage.getPageTitle();
  expect(title).toContain('OnlyTests');
});
```

## 🏷️ Test Organization

Tests are organized by functionality:

- `tests/ui/basic-functionality.spec.ts` - Basic app functionality
- `tests/ui/home.spec.ts` - Home page tests
- `tests/ui/navigation.spec.ts` - Navigation tests
- `tests/ui/tools/` - Tool-specific tests
- `tests/ui/templates/` - Template-specific tests

## 🔍 Code Quality

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

## 🚀 CI/CD

The framework is ready for CI/CD integration with:

- GitHub Actions workflows
- Parallel test execution
- HTML report generation
- Screenshot and video artifacts

## 📚 Architecture Principles

### Simplified Design
- **No over-engineering**: Removed unnecessary interfaces and complex data management
- **Direct class usage**: Pages extend `BasePage` directly
- **Simple test data**: Hardcoded values in tests for better maintainability
- **Minimal configuration**: Only essential environment variables

### Best Practices
1. **Page Object Model**: Clean separation of page logic and test logic
2. **Type Safety**: Full TypeScript support throughout
3. **Environment Management**: Separate configs for different environments
4. **Test Fixtures**: Reusable test setup with page objects
5. **Reporting**: Comprehensive HTML reports with media

### Key Benefits
- ✅ **Easy to understand**: Simple, direct approach
- ✅ **Easy to maintain**: Less code, fewer abstractions
- ✅ **Easy to extend**: Add new pages by extending `BasePage`
- ✅ **Type safe**: Full TypeScript support
- ✅ **Reliable**: Built-in retry mechanisms and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Check the Playwright documentation
- Review the test examples in the `tests/` directory 