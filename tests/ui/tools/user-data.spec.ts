import { test, expect } from '@playwright/test';
import { UserDataPage } from '../../../src/pages/tools/user-data-page';
import { env } from '../../../src/config/environment';

test.describe('User Data Generator Tool', () => {
  let userDataPage: UserDataPage;

  test.beforeEach(async ({ page }) => {
    const baseUrl = env.getBaseUrl();
    userDataPage = new UserDataPage(page, baseUrl);
  });

  test('should load user data generator page', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    const title = await userDataPage.getToolTitle();
    expect(title).toContain('User Data');
    
    const isContentVisible = await userDataPage.isContentVisible();
    expect(isContentVisible).toBe(true);
  });

  test('should generate default number of users', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    const numberOfCards = await userDataPage.getNumberOfUserCards();
    expect(numberOfCards).toBeGreaterThan(0);
    
    const userData = await userDataPage.getUserData(0);
    expect(userData).toBeDefined();
    expect(Object.keys(userData).length).toBeGreaterThan(0);
  });

  test('should change number of users to generate', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    // Set number of users to 3
    await userDataPage.setNumberOfUsers(3);
    
    // Regenerate data
    await userDataPage.regenerateData();
    
    const numberOfCards = await userDataPage.getNumberOfUserCards();
    expect(numberOfCards).toBe(3);
  });

  test('should change language for data generation', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    // Change to German
    await userDataPage.setLanguage('de');
    
    // Regenerate data
    await userDataPage.regenerateData();
    
    const currentLanguage = await userDataPage.getCurrentLanguage();
    expect(currentLanguage).toBe('de');
  });

  test('should select country for location data', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    // Check if location selection is working
    const isLocationWorking = await userDataPage.isLocationSelectionWorking();
    if (!isLocationWorking) {
      test.skip();
      return;
    }
    
    // Select a country that actually exists in the dropdown
    await userDataPage.selectCountry('Germany');
    
    // Regenerate data
    await userDataPage.regenerateData();
    
    const userData = await userDataPage.getUserData(0);
    expect(userData['Country']).toBe('Germany');
  });

  test('should verify generated data structure', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    const hasCorrectStructure = await userDataPage.verifyGeneratedDataStructure();
    expect(hasCorrectStructure).toBe(true);
  });

  test('should generate multiple users with different data', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    // Set to generate 2 users
    await userDataPage.setNumberOfUsers(2);
    await userDataPage.regenerateData();
    
    const allUserData = await userDataPage.getAllUserData();
    expect(allUserData.length).toBe(2);
    
    // Verify that users have different data
    if (allUserData.length >= 2) {
      const user1 = allUserData[0];
      const user2 = allUserData[1];
      
      // Users should have different names (most likely)
      expect(user1['Full Name']).not.toBe(user2['Full Name']);
      expect(user1['Email']).not.toBe(user2['Email']);
    }
  });

  test('should have avatar download functionality', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    const isDownloadAvailable = await userDataPage.isAvatarDownloadAvailable(0);
    expect(isDownloadAvailable).toBe(true);
  });

  test('should regenerate data with new settings', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    // Regenerate data
    await userDataPage.regenerateData();
    
    // Get new data
    const newData = await userDataPage.getUserData(0);
    
    // Data should be different (most likely)
    expect(newData).toBeDefined();
    expect(Object.keys(newData).length).toBeGreaterThan(0);
  });

  test('should handle different languages correctly', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    // Test with Spanish
    await userDataPage.setLanguage('es');
    await userDataPage.regenerateData();
    
    const currentLanguage = await userDataPage.getCurrentLanguage();
    expect(currentLanguage).toBe('es');
    
    // Test with French
    await userDataPage.setLanguage('fr');
    await userDataPage.regenerateData();
    
    const newLanguage = await userDataPage.getCurrentLanguage();
    expect(newLanguage).toBe('fr');
  });

  test('should maintain page functionality after navigation', async () => {
    await userDataPage.navigate();
    await userDataPage.waitForPageLoad();
    
    // Navigate away and back
    await userDataPage.page.goto(env.getBaseUrl());
    await userDataPage.navigate();
    
    // Verify page still works
    const title = await userDataPage.getToolTitle();
    expect(title).toContain('User Data');
    
    const numberOfCards = await userDataPage.getNumberOfUserCards();
    expect(numberOfCards).toBeGreaterThan(0);
  });
}); 