// Terminal functionality
// when webpage loads system is offline
class TerminalPortfolio {
    constructor() {
        this.commandInput = document.getElementById('commandInput');
        this.terminalOutput = document.getElementById('terminalOutput');
        this.timestamp = document.getElementById('timestamp');
        
        this.commands = {
            help: this.showHelp.bind(this),
            about: this.showAbout.bind(this),
            projects: this.showProjects.bind(this),
            skills: this.showSkills.bind(this),
            experience: this.showExperience.bind(this),
            contact: this.showContact.bind(this),
            education: this.showEducation.bind(this),
            certifications: this.showCertifications.bind(this),
            leadership: this.showLeadership.bind(this),
            sudo: this.showSudo.bind(this),
            clear: this.clearTerminal.bind(this),
            whoami: this.whoAmI.bind(this),
            ls: this.listFiles.bind(this),
            pwd: this.showPath.bind(this),
            date: this.showDate.bind(this),
            echo: this.echo.bind(this),
            exit: this.exit.bind(this),
        };

        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }

    init() {
        // Focus on input field
        this.commandInput.focus();
        
        // Handle command input
        this.commandInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Handle command links
        document.querySelectorAll('.command-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const command = e.target.getAttribute('data-command');
                this.executeCommand(command);
            });
        });

        // Update timestamp
        this.updateTimestamp();
        setInterval(() => this.updateTimestamp(), 1000);

        // Keep focus on input
        document.addEventListener('click', () => {
            this.commandInput.focus();
        });
    }

    handleKeyDown(e) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                const command = this.commandInput.value.trim();
                if (command) {
                    this.executeCommand(command);
                    this.commandHistory.unshift(command);
                    this.historyIndex = -1;
                }
                this.commandInput.value = '';
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    this.commandInput.value = this.commandHistory[this.historyIndex];
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.commandInput.value = this.commandHistory[this.historyIndex];
                } else if (this.historyIndex === 0) {
                    this.historyIndex = -1;
                    this.commandInput.value = '';
                }
                break;
                
            case 'Tab':
                e.preventDefault();
                this.autoComplete();
                break;
        }
    }

    executeCommand(input) {
    const [command, ...args] = input.toLowerCase().split(' ');

    // Display the command
    this.addOutput(`Geet@portfolio:~$ ${input}`, 'command');

    // Handle system commands manually
    if (input.toLowerCase() === 'system online') {
        if (document.body.classList.contains('online')) {
            this.addOutput('System is already online.', 'info');
        } else {
            document.body.classList.remove('offline');
            document.body.classList.add('online');

            const statusEl = document.getElementById('systemStatus');
            if (statusEl) statusEl.textContent = 'System: Online';

            this.addOutput('System status set to online.', 'success');
        }
        return;
    }

    if (input.toLowerCase() === 'system offline') {
        if (document.body.classList.contains('offline')) {
            this.addOutput('System is already offline.', 'info');
        } else {
            document.body.classList.remove('online');
            document.body.classList.add('offline');

            const statusEl = document.getElementById('systemStatus');
            if (statusEl) statusEl.textContent = 'System: Offline';

            this.addOutput('System status set to offline.', 'error');
        }
        return;
    }


    // Handle regular commands
    if (this.commands[command]) {
        this.commands[command](args);
    } else {
        this.addOutput(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
    }

    this.scrollToBottom();
}

    addOutput(text, className = '') {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.innerHTML = text;
        this.terminalOutput.appendChild(line);
    }

    scrollToBottom() {
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }

    autoComplete() {
        const input = this.commandInput.value.toLowerCase();
        const allCommands = [
        'system online',
        'system offline',
        ...Object.keys(this.commands)
    ];
        const matches = allCommands.filter(cmd => cmd.startsWith(input));

        if (matches.length === 1) {
            this.commandInput.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(`Available commands: ${matches.join(', ')}`);
            this.scrollToBottom();
        }
    }

    updateTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        this.timestamp.textContent = timeString;
    }

    // Command implementations
    showHelp() {
        const helpText = `
Available commands:
<span style="color: #00ff88;">system online</span>     - Set system status to online,
<span style="color: #00ff88;">system offline</span>    - Set system status to offline,
<span style="color: #00ff88;">help</span>           - Show this help message,
<span style="color: #00ff88;">about</span>          - Learn more about me,
<span style="color: #00ff88;">projects</span>       - View my projects,
<span style="color: #00ff88;">skills</span>         - See my technical skills,
<span style="color: #00ff88;">experience</span>     - View my work experience,
<span style="color: #00ff88;">contact</span>        - Get my contact information,
<span style="color: #00ff88;">education</span>      - View my educational background,
<span style="color: #00ff88;">certifications</span> - See my certifications,
<span style="color: #00ff88;">leadership</span>     - View leadership experience,
<span style="color: #00ff88;">clear</span>          - Clear the terminal,
<span style="color: #00ff88;">sudo</span>           - Try it and see ;),

Additional commands:
<span style="color: #00ff88;">whoami</span>         - Display current user,
<span style="color: #00ff88;">ls</span>             - List directory contents,
<span style="color: #00ff88;">pwd</span>            - Show current directory,
<span style="color: #00ff88;">date</span>           - Show current date and time,
<span style="color: #00ff88;">echo [text]</span>    - Display text,
<span style="color: #00ff88;">exit</span>           - Exit the terminal.

Use Tab for auto-completion and arrow keys for command history.
        `;
        this.addOutput(helpText);
    }

    showAbout() {
        const aboutText = `
<span style="color: #00ff88;">About Me</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<br>
Hello! I'm Geet Prajapati — a cybersecurity enthusiast, game tester, QA tester, and frontend developer. I’ve completed my B.Tech in Computer Engineering with a specialization in Cyber Security from Ganpat University.
<br>
<span style="color: #00ff88;">Key Highlights:</span>
• Game Tester Intern at RedPlum Games  
• Passionate about cybersecurity, ethical hacking, and threat analysis  
• Hands-on experience in game testing, debugging, and UI/UX refinement  
• Skilled in React.js, Snort, C++, and scripting for security automation  
• Effective communicator and collaborative team contributor  
<br>
<span style="color: #00ff88;">Current Focus:</span>  
• Enhancing skills in secure system design and network defense  
• Contributing to game QA processes and performance tuning  
• Developing IoT-based and real-time monitoring systems  
• Gaining real-world experience in cybersecurity environments
        `;
        this.addOutput(aboutText);
    }

    showProjects() {
        const projectsText = `
<span style="color: #00ff88;">My Projects</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<br>
<span style="color: #00ff88;">1. E-Commerce Platform</span>
   • Full-stack web application with React and Node.js
   • Features: User authentication, payment integration, admin panel
   • Technologies: React, Node.js, MongoDB, Stripe API
   • GitHub: github.com/yourusername/ecommerce-platform
<br>
<span style="color: #00ff88;">2. Task Management App</span>
   • Real-time collaborative task management tool
   • Features: Real-time updates, team collaboration, file sharing
   • Technologies: Vue.js, Express.js, Socket.io, PostgreSQL
   • GitHub: github.com/yourusername/task-manager
<br>
<span style="color: #00ff88;">3. Weather Dashboard</span>
   • Interactive weather application with data visualization
   • Features: Location-based weather, forecasts, charts
   • Technologies: JavaScript, Chart.js, Weather API
   • GitHub: github.com/yourusername/weather-dashboard
<br>
<span style="color: #00ff88;">4. Portfolio Website</span>
   • Terminal-style portfolio website (this one!)
   • Features: Interactive terminal, responsive design
   • Technologies: HTML, CSS, JavaScript
   • GitHub: github.com/yourusername/terminal-portfolio
        `;
        this.addOutput(projectsText);
    }

    showSkills() {
        this.addOutput('💻 <span style="color: #00ff88;">Technical Skills:</span>');
        this.addOutput('');
        this.addOutput('<span style="color: #00ff88;">Programming Languages:</span>');
        this.addOutput('- JavaScript/TypeScript');
        this.addOutput('- Python');
        this.addOutput('- C#');
        this.addOutput('- C++');
        this.addOutput('');
        this.addOutput('<span style="color: #00ff88;">Frontend:</span>');
        this.addOutput('- React.js/Next.js');
        this.addOutput('- Redux/Zustand');
        this.addOutput('- Material UI');
        this.addOutput('- Tailwind CSS');
        this.addOutput('');
        this.addOutput('<span style="color: #00ff88;">Backend:</span>');
        this.addOutput('- Node.js/Express.js');
        this.addOutput('- Django/FastAPI');
        this.addOutput('- ASP.NET Core');
        this.addOutput('- REST APIs');
        this.addOutput('');
        this.addOutput('<span style="color: #00ff88;">Databases:</span>');
        this.addOutput('- MongoDB');
        this.addOutput('- PostgreSQL');
        this.addOutput('- MySQL');
        this.addOutput('- Redis');
        this.addOutput('');
        this.addOutput('<span style="color: #00ff88;">Cloud & DevOps:</span>');
        this.addOutput('- AWS/Azure/GCP');
        this.addOutput('- Docker/Kubernetes');
        this.addOutput('- CI/CD Pipelines');
        this.addOutput('- Linux/Unix');
        this.addOutput('');
        this.addOutput('<span style="color: #00ff88;">Tools:</span>');
        this.addOutput('- Git/GitHub');
        this.addOutput('- VS Code');
        this.addOutput('- Postman');
        this.addOutput('- Figma');
    }

    showExperience() {
        const experienceText = `
<span style="color: #00ff88;">Work Experience</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<br>

<span style="color: #00ff88;">Game Tester</span> | RedPlum Games  
📅 2023 – Present  
• Conducted comprehensive game testing to identify bugs, glitches, and performance issues  
• Collaborated with developers to refine game mechanics and improve UI/UX  
• Performed functional, regression, and stress testing for performance optimization  
• Ensured seamless gameplay experience through continuous QA feedback  

<br>

<span style="color: #00ff88;">Game Tester & Developer Intern</span> | RedPlum Games  
📅 2025 – 2025  
• Contributed to development and QA for various gaming projects  
• Executed rigorous quality assurance tests and debugging routines  
• Enhanced UI/UX collaboratively with the game dev team  
• Created a playable game prototype –  
  <a href="https://drive.google.com/drive/folders/1SIqgbHdFObjvoTtb0ZT3udVtsIGN_pVV" target="_blank">Check it out</a>  

<br>

<span style="color: #00ff88;">Cybersecurity Lab Intern</span> | Cyber Security Lab Building  
📅 2018 – 2019  
• Set up and configured lab environments using security tools and virtual machines  
• Simulated real-world cyber threats to practice penetration testing and response  
• Performed vulnerability assessments and network defense drills  
• Strengthened skills in threat analysis and ethical hacking practices  

        `;
        this.addOutput(experienceText);
    }

    showContact() {
        const contactText = `
<span style="color: #00ff88;">Contact Information</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<br>
<span style="color: #00ff88;">📧 Email:</span>        prajapatigeet12@gmail.com
<span style="color: #00ff88;">📱 Phone:</span>         +917990143224
<span style="color: #00ff88;">🌐 Website:</span>      https://yourportfolio.com
<span style="color: #00ff88;">💼 LinkedIn:</span>     https://www.linkedin.com/in/geetprajapati12
<span style="color: #00ff88;">🐙 GitHub:</span>       https://github.com/GeetBoss
<span style="color: #00ff88;">📍 Location:</span>      Ahmedabad, Gujarat, India

<span style="color: #00ff88;">Availability:</span>
• Open to new opportunities
• Available for freelance projects
• Happy to discuss collaboration

Feel free to reach out! I'm always interested in discussing new projects,
opportunities, or just having a chat about technology.
        `;
        this.addOutput(contactText);
    }

    showEducation() {
        const educationText = `
<span style="color: #00ff88;">Education</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<span style="color: #00ff88;">B.Tech in Computer Engineering (Cyber Security)</span>  
🎓 Ganpat University, ICT | 2022 – 2025  
• CGPA: 6.43  
• Focus Areas: Cybersecurity, Ethical Hacking, Network Security, Game Development  

<span style="color: #00ff88;">Diploma in Computer Engineering</span>  
🎓 Ganpat University, IoT | 2019 – 2022  
• CGPA: 7.80  
• Focus Areas: Computer Fundamentals, Programming, IoT Systems, Project Work

<span style="color: #00ff88;">Online Courses & Certifications:</span>
• Full Stack Web Development Bootcamp (2019)
• AWS Certified Developer Associate (2021)
• Google Cloud Professional Developer (2022)
• MongoDB Certified Developer (2020)

<span style="color: #00ff88;">Academic Projects:</span>
• Final Year Project: AI-powered Recommendation System
• Database Management System for Library
• Mobile App Development using React Native
• Machine Learning Classification Project
        `;
        this.addOutput(educationText);
    }

    showCertifications() {
        const certificationsText = `
<span style="color: #00ff88;">Certifications</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<br>
<span style="color: #00ff88;">Cloud Certifications:</span>
• Google Cloud Skills Boost – Cloud Functions: 3 Ways (Nov 2024)  
• Google Cloud Skills Boost – Get Started with Dataplex (Nov 2024)  
• Google Cloud Skills Boost – Looker Smart Analytics (Nov 2024)  
• Google Cloud Skills Boost – API Gateway Skill Badge (Oct 2024)  
• Google Cloud Skills Boost – Cloud Storage Management (Oct 2024)  
• Google Cloud Skills Boost – Google Cloud Compute Basics (Oct 2024)  
• GDSC UVPCE – Google Cloud Study Jams (Feb 2024)  
• Google Cloud Skills Boost – Google Cloud Security & Operations (Nov 2023)
<br>
<span style="color: #00ff88;">Development & Programming:</span>
//arrange in point wise
• Unity – Unity Essentials Pathway (Jul 2024)  
• Coursera – Game Development with Scratch (Aug 2024)  
• Postman – API Fundamentals Student Expert (Nov 2024)  
• DataCamp – Introduction to Python (Jan 2023)  
• DataCamp – Foundations of Probability in Python (Feb 2023)  
• DataCamp – Introduction to SQL (Sep 2022)
<br>
<span style="color: #00ff88;">Data & Machine Learning:</span>
• Cognitive Class – Big Data 101 (Nov 2022)  
• Cognitive Class – Machine Learning with Python (Nov 2022)  
• Cognitive Class – Python 101 for Data Science (Nov 2022)  
• Cognitive Class – SQL and Relational Databases 101 (Nov 2022)
<br>
<span style="color: #00ff88;">Cybersecurity & Simulations:</span>
• Deloitte Australia – Cyber Job Simulation (Jun 2025)  
• Wilco – GitHub Copilot: Code Smarter (Jul 2025)
<br>
<span style="color: #00ff88;">Continuous Learning:</span>
• Completed 20+ hands-on labs and certifications via Google Cloud Skills Boost  
• Verified certificates and badges:  
  https://drive.google.com/drive/folders/1JO63AnLyrIuzTVrwTjdNV_WxbFDBPqAY  
  https://www.credly.com/users/geet-prajapati

        `;
        this.addOutput(certificationsText);
    }

    showLeadership() {
        const leadershipText = `
<span style="color: #00ff88;">Leadership & Activities</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<br>
<span style="color: #00ff88;">Professional Leadership:</span>
• Team Lead for 5-person development team (2022-Present)
• Mentored 10+ junior developers and interns
• Led technical architecture decisions for major projects
• Organized and conducted technical workshops and training sessions
<br>
<span style="color: #00ff88;">Community Involvement:</span>
• Volunteer coding instructor at local community center
• Speaker at 3 tech conferences and meetups
• Organizer of monthly JavaScript meetup group
• Contributor to open-source projects with 500+ GitHub stars
<br>
<span style="color: #00ff88;">Academic Leadership:</span>
• President of Computer Science Student Association (2018-2019)
• Teaching Assistant for Data Structures course (2018)
• Organized university hackathon with 200+ participants
• Peer tutor for programming courses
<br>
<span style="color: #00ff88;">Achievements:</span>
• Winner of Regional Hackathon 2019
• Best Team Player Award at TechCorp (2022)
• Outstanding Student Award in Computer Science (2019)
• Published 2 technical articles with 10K+ views
        `;
        this.addOutput(leadershipText);
    }

    showSudo() {
        const sudoText = `
<span style="color: #ff4444;">[sudo] password for Geet:</span> 

<span style="color: #ff4444;">Access Denied!</span>

Just kidding! 😄 You don't need sudo privileges to explore my portfolio.
But I appreciate your curiosity about system administration!

<span style="color: #00ff88;">Fun fact:</span> I'm quite comfortable with Linux systems and have experience with:
• System administration and server management
• Shell scripting and automation
• Docker containerization
• CI/CD pipeline setup
• Cloud infrastructure management

Try other commands to learn more about my skills and experience!
        `;
        this.addOutput(sudoText);
    }

    clearTerminal() {
        this.terminalOutput.innerHTML = '';
        this.addOutput('Terminal cleared. Type "help" to see available commands.');
    }

    whoAmI() {
        this.addOutput('yourname');
    }

    listFiles() {
        const files = `
total 8
drwxr-xr-x  2 Geet 4096 Jan 10 15:30 <span style="color: #00ff88;">projects/</span>
drwxr-xr-x  2 Geet 4096 Jan 10 15:30 <span style="color: #00ff88;">skills/</span>
drwxr-xr-x  2 Geet 4096 Jan 10 15:30 <span style="color: #00ff88;">experience/</span>
-rw-r--r--  1 Geet 1024 Jan 10 15:30 about.txt
-rw-r--r--  1 Geet  512 Jan 10 15:30 contact.txt
-rw-r--r--  1 Geet  256 Jan 10 15:30 resume.pdf
        `;
        this.addOutput(files);
    }

    showPath() {
        this.addOutput('/home/Geet/portfolio');
    }

    showDate() {
        const now = new Date();
        this.addOutput(now.toString());
    }

    echo(args) {
        if (args.length === 0) {
            this.addOutput('');
        } else {
            this.addOutput(args.join(' '));
        }
    }

    // close the terminal and current webpage
    exit() {
    let countdown = 10;

    // Create or get the countdown line
    const line = document.createElement('div');
    line.className = 'output-line info';
    line.id = 'countdown-line';
    this.terminalOutput.appendChild(line);

    const interval = setInterval(() => {
        line.innerHTML = `Closing terminal in ${countdown} second${countdown !== 1 ? 's' : ''}, Goodbye!`;
        countdown--;
        setTimeout(() => {
            this.terminalOutput.innerHTML = '';
            window.close();
        }, 10000);
    }, 1000);
}

}

// Initialize the terminal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TerminalPortfolio();
    // Set initial system status to offline
    document.body.classList.add('offline');
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Profile card 3D effect
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.addEventListener('mousemove', (e) => {
            const rect = profileCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        profileCard.addEventListener('mouseleave', () => {
            profileCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    }
});