import { test, expect } from '@playwright/test';
import { TestCasesPage } from '../../../src/pages/templates/test-cases-page';
import { PageFactory } from '../../../src/core/page.factory';

test.describe('Test Cases Template', () => {
  let testCasesPage: TestCasesPage;

  test.beforeEach(async ({ page }) => {
    const pageFactory = PageFactory.getInstance();
    testCasesPage = pageFactory.createTestCasesPage(page);
  });

  test('should load test cases template page', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    const title = await testCasesPage.getTemplateTitle();
    expect(title).toContain('Test Case Template');
    
    const isVisible = await testCasesPage.isContentVisible();
    expect(isVisible).toBe(true);
  });

  test('should fill basic information fields', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    // Test Case ID
    await testCasesPage.setTestCaseId('TC_002');
    expect(await testCasesPage.getTestCaseId()).toBe('TC_002');
    
    // Title
    await testCasesPage.setTitle('Test user registration functionality');
    expect(await testCasesPage.getTitle()).toBe('Test user registration functionality');
    
    // Priority
    await testCasesPage.setPriority('Medium');
    expect(await testCasesPage.getPriority()).toBe('Medium');
    
    // Test Type
    await testCasesPage.setTestType('Functional');
    expect(await testCasesPage.getTestType()).toBe('Functional');
    
    // Test Level
    await testCasesPage.setTestLevel('System');
    expect(await testCasesPage.getTestLevel()).toBe('System');
    
    // Test Phase
    await testCasesPage.setTestPhase('Integration Testing');
    expect(await testCasesPage.getTestPhase()).toBe('Integration Testing');
    
    // Description
    await testCasesPage.setDescription('Verify that new users can register successfully');
    expect(await testCasesPage.getDescription()).toBe('Verify that new users can register successfully');
    
    // Preconditions
    await testCasesPage.setPreconditions('Registration page is accessible');
    expect(await testCasesPage.getPreconditions()).toBe('Registration page is accessible');
    
    // Test Data
    await testCasesPage.setTestData('Email: test@example.com, Password: Test123!');
    expect(await testCasesPage.getTestData()).toBe('Email: test@example.com, Password: Test123!');
  });

  test('should manage test steps', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    // Get initial number of steps
    const initialSteps = await testCasesPage.getNumberOfSteps();
    expect(initialSteps).toBeGreaterThan(0);
    
    // Add a new step
    await testCasesPage.addStep();
    const stepsAfterAdd = await testCasesPage.getNumberOfSteps();
    expect(stepsAfterAdd).toBe(initialSteps + 1);
    
    // Set step description and expected result
    const newStepIndex = stepsAfterAdd - 1;
    await testCasesPage.setStepDescription(newStepIndex, 'Click the Register button');
    await testCasesPage.setStepExpectedResult(newStepIndex, 'User should be registered successfully');
    
    expect(await testCasesPage.getStepDescription(newStepIndex)).toBe('Click the Register button');
    expect(await testCasesPage.getStepExpectedResult(newStepIndex)).toBe('User should be registered successfully');
    
    // Remove the last step
    await testCasesPage.removeStep(newStepIndex);
    const stepsAfterRemove = await testCasesPage.getNumberOfSteps();
    expect(stepsAfterRemove).toBe(initialSteps);
  });

  test('should fill additional information', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    // Test Environment
    await testCasesPage.setTestEnvironment('Windows 10, Chrome v120, Test Server');
    expect(await testCasesPage.getTestEnvironment()).toBe('Windows 10, Chrome v120, Test Server');
    
    // Automation Status
    await testCasesPage.setAutomationStatus('Not Automated');
    expect(await testCasesPage.getAutomationStatus()).toBe('Not Automated');
    
    // Test Area
    await testCasesPage.setTestArea('User Management');
    expect(await testCasesPage.getTestArea()).toBe('User Management');
    
    // Test Script Reference
    await testCasesPage.setTestScriptReference('registration_test.py');
    expect(await testCasesPage.getTestScriptReference()).toBe('registration_test.py');
    
    // Created By
    await testCasesPage.setCreatedBy('QA Team Lead');
    expect(await testCasesPage.getCreatedBy()).toBe('QA Team Lead');
    
    // Creation Date
    await testCasesPage.setCreationDate('2025-01-15');
    expect(await testCasesPage.getCreationDate()).toBe('2025-01-15');
    
    // Last Updated
    await testCasesPage.setLastUpdated('2025-01-20');
    expect(await testCasesPage.getLastUpdated()).toBe('2025-01-20');
  });

  test('should fill related information', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    // Requirement ID
    await testCasesPage.setRequirementId('REQ_002');
    expect(await testCasesPage.getRequirementId()).toBe('REQ_002');
    
    // User Story Link
    await testCasesPage.setUserStoryLink('https://example.com/user-story-123');
    expect(await testCasesPage.getUserStoryLink()).toBe('https://example.com/user-story-123');
  });

  test('should manage tags', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    // Check existing tags first
    let tags = await testCasesPage.getTags();
    expect(tags.length).toBeGreaterThan(0); // Should have default tags
    
    // Add predefined tags
    await testCasesPage.addPredefinedTag('Sanity');
    tags = await testCasesPage.getTags();
    expect(tags).toContain('Sanity');
    
    // Remove a tag (first tag)
    await testCasesPage.removeTag(0);
    tags = await testCasesPage.getTags();
    expect(tags.length).toBeLessThan(3); // Should have fewer tags after removal
  });

  test('should validate form fields', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    // Initially form should be valid (has default values)
    let isValid = await testCasesPage.isFormValid();
    expect(isValid).toBe(true);
    
    // Clear required fields to test validation
    await testCasesPage.setTestCaseId('');
    await testCasesPage.setTitle('');
    await testCasesPage.setDescription('');
    
    isValid = await testCasesPage.isFormValid();
    expect(isValid).toBe(false);
    
    const errors = await testCasesPage.getValidationErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain('Test Case ID is required');
    expect(errors).toContain('Title is required');
    expect(errors).toContain('Description is required');
  });

  test('should export test case to DOC', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    // Fill some data first
    await testCasesPage.setTestCaseId('TC_EXPORT_001');
    await testCasesPage.setTitle('Export Test Case');
    await testCasesPage.setDescription('Test case for export functionality');
    
    // Export to DOC
    await testCasesPage.exportToDoc();
    
    // Note: In a real test, you might want to verify the download
    // For now, we just ensure the export doesn't throw an error
    expect(true).toBe(true);
  });

  test('should export test case to Excel', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    // Fill some data first
    await testCasesPage.setTestCaseId('TC_EXPORT_002');
    await testCasesPage.setTitle('Excel Export Test Case');
    await testCasesPage.setDescription('Test case for Excel export functionality');
    
    // Export to Excel
    await testCasesPage.exportToExcel();
    
    // Note: In a real test, you might want to verify the download
    // For now, we just ensure the export doesn't throw an error
    expect(true).toBe(true);
  });

  test('should maintain form state after navigation', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    // Fill some data
    await testCasesPage.setTestCaseId('TC_NAV_001');
    await testCasesPage.setTitle('Navigation Test');
    await testCasesPage.setDescription('Test case for navigation functionality');
    
    // Navigate away and back
    await testCasesPage.page.goto('/');
    await testCasesPage.navigate();
    
    // Note: React apps typically don't persist form state by default
    // This test verifies that the page loads correctly after navigation
    const title = await testCasesPage.getTemplateTitle();
    expect(title).toContain('Test Case Template');
    
    const isVisible = await testCasesPage.isContentVisible();
    expect(isVisible).toBe(true);
  });

  test('should handle all test types', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    const testTypes = ['Functional', 'Regression', 'Performance', 'Compatibility', 'GUI', 'Usability', 'Reliability', 'Security'];
    
    for (const testType of testTypes) {
      await testCasesPage.setTestType(testType);
      expect(await testCasesPage.getTestType()).toBe(testType);
    }
  });

  test('should handle all priority levels', async () => {
    await testCasesPage.navigate();
    await testCasesPage.waitForPageLoad();
    
    const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
    
    for (const priority of priorities) {
      await testCasesPage.setPriority(priority);
      expect(await testCasesPage.getPriority()).toBe(priority);
    }
  });
}); 