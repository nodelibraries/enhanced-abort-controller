// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // Update active nav item
      document.querySelectorAll('.nav-item').forEach((item) => {
        item.classList.remove('active');
      });
      this.classList.add('active');
    }
  });
});

// Update active nav item on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach((item) => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// Copy code block functionality
document.querySelectorAll('.code-block').forEach((block) => {
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.textContent = 'Copy';
  button.style.cssText = `
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #3d3d3d;
    color: white;
    border: none;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    opacity: 0.7;
    transition: opacity 0.2s;
  `;
  button.addEventListener('mouseenter', () => {
    button.style.opacity = '1';
  });
  button.addEventListener('mouseleave', () => {
    button.style.opacity = '0.7';
  });
  button.addEventListener('click', () => {
    const code = block.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
  });
  const header = block.querySelector('.code-header');
  if (header) {
    header.style.position = 'relative';
    header.appendChild(button);
  }
});

