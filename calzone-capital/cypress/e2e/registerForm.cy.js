describe('Registration Form Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/register');
    });

    it('displays all required fields', () => {
      // Check for the existence of each input field
      cy.get('input[placeholder="Email Address"]').should('be.visible');
      cy.get('input[placeholder="Password"]').should('be.visible');
      cy.get('input[placeholder="First Name"]').should('be.visible');
      cy.get('input[placeholder="Last Name"]').should('be.visible');
      cy.get('input[placeholder="Date of Birth"]').should('be.visible');
      cy.get('input[placeholder="Phone Number"]').should('be.visible');
      cy.get('button').contains('Register').should('be.visible');
    });
  
    it('requires all fields to be filled', () => {
      cy.get('button').contains('Register').click();
      cy.get('p').contains('All fields are necessary.').should('be.visible');
    });
  
    it('validates password lenght', () => {
      // Fill all other fields except password
      cy.get('input[placeholder="Email Address"]').type('user@example.com');
      cy.get('input[placeholder="First Name"]').type('John');
      cy.get('input[placeholder="Last Name"]').type('Doe');
      cy.get('input[placeholder="Date of Birth"]').type('1990-01-01');
      cy.get('input[placeholder="Phone Number"]').type('9876543210');
      // Enter a short password
      cy.get('input[placeholder="Password"]').type('short');
      cy.get('button').contains('Register').click();
      cy.get('p').contains('Password must be at least 8 characters long.').should('be.visible');
    });
  
    it('validates age requirement', () => {
      // Fill all other fields with valid data
      cy.get('input[placeholder="Email Address"]').type('user@example.com');
      cy.get('input[placeholder="Password"]').type('password123456');
      cy.get('input[placeholder="First Name"]').type('John');
      cy.get('input[placeholder="Last Name"]').type('Doe');
      cy.get('input[placeholder="Phone Number"]').type('9876543210');
      // Set an invalid date of birth
      cy.get('input[placeholder="Date of Birth"]').type('2015-01-01');
      cy.get('button').contains('Register').click();
      cy.get('p').contains('You must be at least 18 years old to register.').should('be.visible');
    });
  
    it('validates phone number format', () => {
      // Fill all other fields with valid data
      cy.get('input[placeholder="Email Address"]').type('user@example.com');
      cy.get('input[placeholder="Password"]').type('password123456');
      cy.get('input[placeholder="First Name"]').type('John');
      cy.get('input[placeholder="Last Name"]').type('Doe');
      cy.get('input[placeholder="Date of Birth"]').type('1990-01-01');
      // Enter an invalid phone number
      cy.get('input[placeholder="Phone Number"]').type('12345');
      cy.get('button').contains('Register').click();
      cy.get('p').contains('Invalid phone number format.').should('be.visible');
    });
  
    it('submits the form with valid inputs', () => {
      // Fill in all fields with valid data
      cy.get('input[placeholder="Email Address"]').type('user@example.com');
      cy.get('input[placeholder="Password"]').type('password123456');
      cy.get('input[placeholder="First Name"]').type('John');
      cy.get('input[placeholder="Last Name"]').type('Doe');
      cy.get('input[placeholder="Date of Birth"]').type('1990-01-01');
      cy.get('input[placeholder="Phone Number"]').type('9876543210');
  
      // Intercepting and mocking the response for the API call
      cy.intercept('POST', 'api/register', { statusCode: 200 }).as('apiCheck');
  
      cy.get('button').contains('Register').click();
  
      // Verify the API call was made with the correct payload
      cy.wait('@apiCheck').its('request.body').should('deep.equal', {
        email: 'user@example.com',
        password: 'password123456',
        firstName: 'John',
        lastName: 'Doe',
        dob: '1990-01-01',
        phoneNumber: '9876543210'
      });
  
      // Assuming you'd be redirected to the login page on successful registration
      cy.url().should('include', '/login');
    });
  });
  