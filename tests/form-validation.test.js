// Unit tests for form validation functionality
describe('Form Validation', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <form id="contact-form">
        <input type="text" id="name" name="name" required>
        <input type="email" id="email" name="email" required>
        <textarea id="message" name="message" required></textarea>
        <button type="submit">Submit</button>
      </form>
    `;
  });

  test('should validate required fields', () => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Test empty values
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(messageInput.value).toBe('');
    
    // Test required attribute
    expect(nameInput.required).toBe(true);
    expect(emailInput.required).toBe(true);
    expect(messageInput.required).toBe(true);
  });

  test('should validate email format', () => {
    const emailInput = document.getElementById('email');
    
    // Test invalid email
    emailInput.value = 'invalid-email';
    expect(emailInput.checkValidity()).toBe(false);
    
    // Test valid email
    emailInput.value = 'test@example.com';
    expect(emailInput.checkValidity()).toBe(true);
  });

  test('should handle form submission', () => {
    const form = document.getElementById('contact-form');
    const submitEvent = createMockEvent('submit');
    submitEvent.preventDefault = jest.fn();
    
    let formSubmitted = false;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formSubmitted = true;
    });
    
    form.dispatchEvent(submitEvent);
    
    expect(submitEvent.preventDefault).toHaveBeenCalled();
    expect(formSubmitted).toBe(true);
  });

  test('should collect form data', () => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Set form values
    nameInput.value = 'John Doe';
    emailInput.value = 'john@example.com';
    messageInput.value = 'Test message';
    
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    
    expect(formData.get('name')).toBe('John Doe');
    expect(formData.get('email')).toBe('john@example.com');
    expect(formData.get('message')).toBe('Test message');
  });
});