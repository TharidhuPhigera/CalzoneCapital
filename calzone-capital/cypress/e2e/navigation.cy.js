describe('Navigation Flow Tests', () => {
    beforeEach(() => {
      // Visit the landing page before each test
      cy.visit('http://localhost:3000/');
    });
  
    it('Navigates from landing page to registration page', () => {
      // Click on the 'Get Started' button
      cy.contains('Get Started').click();
  
      // Assert that the URL has changed to the registration page
      cy.url().should('include', '/register');
    });
  
    it('Navigates from landing page to login page', () => {
      // Click on the 'Log In' link
      cy.contains('Log In').click();
  
      // Assert that the URL has changed to the login page
      cy.url().should('include', '/login');
    });
  
    it('Navigates from registration page to login page', () => {
      // Visit the registration page
      cy.visit('http://localhost:3000//register');
  
      // Click on the 'Log In Here' link
      cy.contains('Log In').click();
  
      // Assert that the URL has changed to the login page
      cy.url().should('include', '/login');
    });
  
    it('Navigates to home page', () => {
      // Visit the login page
      cy.visit('http://localhost:3000//login');
  
      // Enter valid login credentials
      cy.get('input[placeholder="Email Address"]').type('admin@email.com');
      cy.get('input[placeholder="Password"]').type('admin123');
      cy.get('button').contains('Sign In').click();
  
      // Assert that the URL has changed to the home page after successful login
      cy.url().should('include', '/home');
    });

    it('Navigates to market page', () => {
      // Log in to the application first
      cy.visit('http://localhost:3000/login');
      cy.get('input[placeholder="Email Address"]').type('admin@email.com');
      cy.get('input[placeholder="Password"]').type('admin123');
      cy.get('button').contains('Sign In').click();
    
      // Wait for the home page to load after logging in
      cy.url().should('include', '/home');
    
      // Click on the element that leads to the market page
      cy.contains('Discover').click();
    
      // Assert that the URL has changed to the market page
      cy.url().should('include', '/market');
    });

    it('Navigates to profile page', () => {
      // Log in to the application first
      cy.visit('http://localhost:3000/login');
      cy.get('input[placeholder="Email Address"]').type('admin@email.com');
      cy.get('input[placeholder="Password"]').type('admin123');
      cy.get('button').contains('Sign In').click();
    
      // Wait for the home page to load after logging in
      cy.url().should('include', '/home');
    
      // Click on the element that leads to the market page
      cy.contains('Profile').click();
    
      // Assert that the URL has changed to the market page
      cy.url().should('include', '/profile');
    });

    it('Logouts after Logged In', () => {
      // Log in to the application first
      cy.visit('http://localhost:3000/login');
      cy.get('input[placeholder="Email Address"]').type('admin@email.com');
      cy.get('input[placeholder="Password"]').type('admin123');
      cy.get('button').contains('Sign In').click();
    
      // Wait for the home page to load after logging in
      cy.url().should('include', '/home');
    
      // Click on the element that leads to the market page
      cy.contains('Logout').click();
    
      // Assert that the URL has changed to the market page
      cy.url().should('include', '/');
    });

  });
  