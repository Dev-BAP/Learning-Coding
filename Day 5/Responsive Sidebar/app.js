const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar(){
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')

  closeAllSubMenus()
}

function toggleSubMenu(button){

  if(!button.nextElementSibling.classList.contains('show')){
    closeAllSubMenus()
  }

  button.nextElementSibling.classList.toggle('show')
  button.classList.toggle('rotate')

  if(sidebar.classList.contains('close')){
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
  }
}

function closeAllSubMenus(){
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}

document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.querySelector('.edit-btn');
    const messageBtn = document.querySelector('.message-btn');
    const editModal = document.getElementById('editModal');
    const messageModal = document.getElementById('messageModal');
    const editForm = document.getElementById('editProfileForm');
    const messageForm = document.getElementById('messageForm');
    const closeButtons = document.querySelectorAll('.modal-close');

    // Open modals
    editBtn?.addEventListener('click', () => {
        editModal.classList.add('active');
        // Pre-fill form with current values
        const fields = ['email', 'location', 'skills'];
        fields.forEach(field => {
            const input = editModal.querySelector(`#${field}`);
            const currentValue = document.querySelector(`.profile-info li:contains("${field}")`).textContent.split(':')[1].trim();
            input.value = currentValue;
        });
    });

    messageBtn?.addEventListener('click', () => {
        messageModal.classList.add('active');
    });

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            editModal.classList.remove('active');
            messageModal.classList.remove('active');
        });
    });

    // Close on overlay click
    [editModal, messageModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Handle form submissions
    editForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        
        // Update profile info
        Object.entries(Object.fromEntries(formData)).forEach(([key, value]) => {
            const element = document.querySelector(`.profile-info li:contains("${key}")`);
            if (element) {
                element.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}`;
                localStorage.setItem(`profile_${key}`, value);
            }
        });

        editModal.classList.remove('active');
    });

    messageForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageForm.message.value;
        if (message) {
            alert('Message sent successfully!');
            messageForm.reset();
            messageModal.classList.remove('active');
        }
    });
});
// ...existing code...

// Calendar functionality
document.addEventListener('DOMContentLoaded', () => {
    const calendarBody = document.getElementById('calendar-body');
    const monthYearElement = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    function generateCalendar(month, year) {
        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);
        
        // Update month-year display
        monthYearElement.textContent = `${months[month]} ${year}`;
        
        // Clear existing calendar
        calendarBody.innerHTML = '';
        
        let date = 1;
        let dayOfWeek = firstDay.getDay();

        // Create calendar rows
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            
            // Create calendar cells
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                
                if (i === 0 && j < dayOfWeek) {
                    // Empty cells before first day
                    cell.classList.add('other-month');
                    const lastMonthLastDay = new Date(year, month, 0).getDate();
                    cell.textContent = lastMonthLastDay - (dayOfWeek - j - 1);
                } else if (date > lastDay.getDate()) {
                    // Empty cells after last day
                    cell.classList.add('other-month');
                    cell.textContent = date - lastDay.getDate();
                    date++;
                } else {
                    // Current month cells
                    cell.textContent = date;
                    
                    // Highlight today's date
                    if (date === currentDate.getDate() && 
                        month === currentDate.getMonth() && 
                        year === currentDate.getFullYear()) {
                        cell.classList.add('today');
                    }
                    
                    // Add click event
                    cell.addEventListener('click', () => {
                        document.querySelectorAll('.calendar-table td.selected')
                            .forEach(td => td.classList.remove('selected'));
                        cell.classList.add('selected');
                    });
                    
                    date++;
                }
                
                row.appendChild(cell);
            }
            
            calendarBody.appendChild(row);
            
            // Stop if we've reached the end of the month
            if (date > lastDay.getDate()) break;
        }
    }

    // Event listeners for navigation buttons
    prevMonthBtn?.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    nextMonthBtn?.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    // Initialize calendar
    if (calendarBody) {
        generateCalendar(currentMonth, currentYear);
    }
});