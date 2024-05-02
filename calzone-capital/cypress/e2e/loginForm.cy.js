describe('Login Form Tests', () => {
    beforeEach(() => {
        // Visit the login page before each test
        cy.visit('http://localhost:3000/login');
    });

    it('displays all required fields and the login button', () => {
        // Check for the existence of input fields and the login button
        cy.get('input[placeholder="Email Address"]').should('be.visible');
        cy.get('input[placeholder="Password"]').should('be.visible');
        cy.get('button').contains('Sign In').should('be.visible');
    });

    it('allows user to enter login credentials', () => {
        // Type into the email and password fields
        cy.get('input[placeholder="Email Address"]').type('user@example.com');
        cy.get('input[placeholder="Password"]').type('password123');
        // Check if the input values are correctly typed
        cy.get('input[placeholder="Email Address"]').should('have.value', 'user@example.com');
        cy.get('input[placeholder="Password"]').should('have.value', 'password123');
    });

    it('shows error message on invalid credentials', () => {
        // Attempt to log in with invalid credentials
        cy.get('input[placeholder="Email Address"]').type('admin@email.com');
        cy.get('input[placeholder="Password"]').type('wrongpassword');
        cy.get('button').contains('Sign In').click();
        cy.get('p').contains('Invalid Credentials').should('be.visible');
    });

    it('logs in with correct credentials', () => {   
        // Enter valid login credentials
        cy.get('input[placeholder="Email Address"]').type('admin@email.com');
        cy.get('input[placeholder="Password"]').type('admin123');
        cy.get('button').contains('Sign In').click();
        // Assert that the URL has changed to the home page after successful login
        cy.url().should('include', '/home');
      });

    it('navigates from login page to registration page', () => {
      // Click on the 'Log In Here' link
      cy.contains('Register Here').click();
      // Assert that the URL has changed to the login page
      cy.url().should('include', '/register');
    });

});
