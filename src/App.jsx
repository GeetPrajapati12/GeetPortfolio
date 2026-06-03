import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Text, useGLTF, useTexture } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

const CARD_MODEL =
  'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb'
const BAND_TEXTURE =
  'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg'

const commandLinks = [
  'Help',
  'About',
  'Projects',
  'Skills',
  'Experience',
  'Contact',
  'Education',
  'Certifications',
  'Leadership',
  'Sudo',
  'Clear',
  'System Online',
  'System Offline',
  'Exit',
]

useGLTF.preload(CARD_MODEL)
useTexture.preload(BAND_TEXTURE)

export default function App() {
  const [isOnline, setIsOnline] = useState(false)
  const [timestamp, setTimestamp] = useState('')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [lines, setLines] = useState([
    { text: 'Welcome to my portfolio terminal!' },
    { text: "Type 'help' to see available commands." },
  ])
  const outputRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const tick = () => {
      setTimestamp(
        new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
      )
    }

    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight })
  }, [lines])

  const addLine = (text, className = '') => {
    setLines((current) => [...current, { text, className }])
  }

  const clearTerminal = () => {
    setLines([{ text: 'Terminal cleared. Type "help" to see available commands.' }])
  }

  const executeCommand = (rawInput) => {
    const value = rawInput.trim()
    if (!value) return

    const normalized = value.toLowerCase()
    const [command, ...args] = normalized.split(' ')
    addLine(`Geet@portfolio:~$ ${value}`, 'command')

    if (normalized === 'system online') {
      if (isOnline) addLine('System is already online.', 'info')
      else {
        setIsOnline(true)
        addLine('System status set to online.', 'success')
      }
      return
    }

    if (normalized === 'system offline') {
      if (!isOnline) addLine('System is already offline.', 'info')
      else {
        setIsOnline(false)
        addLine('System status set to offline.', 'error')
      }
      return
    }

    const commands = {
      help: () =>
        addLine(`Available commands:
system online, system offline, help, about, projects, skills, experience, contact, education, certifications, leadership, sudo, clear, whoami, ls, pwd, date, echo [text], exit

Use Tab for auto-completion and arrow keys for command history.`),
      about: () =>
        addLine(`About Me
--------------------------------------------------------------------------------
Hello! I'm Geet Prajapati, a cybersecurity enthusiast, game tester, QA tester, and frontend developer.

Key Highlights:
- Game Tester Intern at RedPlum Games
- Passionate about cybersecurity, ethical hacking, and threat analysis
- Hands-on experience in game testing, debugging, and UI/UX refinement
- Skilled in React.js, Snort, C++, and scripting for security automation`),
      projects: () =>
        addLine(`My Projects
--------------------------------------------------------------------------------
1. Automatic Street Light based on IoT
   - Smart lighting control using real-time environmental data.
   - Technologies: IoT sensors, microcontrollers, embedded systems.

2. Enhancing Real-Time Noise Pollution Monitoring in Urban Areas
   - Real-time web system to monitor and visualize urban noise pollution.
   - Technologies: React.js, Node.js, MongoDB, sensor integration.`),
      skills: () =>
        addLine(`Technical Skills
--------------------------------------------------------------------------------
Programming: JavaScript/TypeScript, Python, C#, C++
Frontend: React.js, Next.js, Tailwind CSS
Backend: Node.js, Express.js
Databases: MongoDB, MySQL
Tools: Git/GitHub, VS Code, Jira, Figma`),
      experience: () =>
        addLine(`Work Experience & Internships
--------------------------------------------------------------------------------
Manual Tester at Macrobian Games (2025 - Present)
- Functional, regression, hardware-level, website, UI/UX, and basic security testing.

Game Tester at RedPlum Games (2023 - Present)
- Game QA, bug reporting, regression testing, stress testing, and gameplay validation.

Game Tester & Developer Intern at RedPlum Games (2025)
- Testing and development support across game projects.`),
      contact: () =>
        addLine(`Contact Information
--------------------------------------------------------------------------------
Email: prajapatigeet12@gmail.com
Phone: +91 7990143224
LinkedIn: https://www.linkedin.com/in/geetprajapati12
GitHub: https://github.com/GeetBoss
Location: Ahmedabad, Gujarat, India`),
      education: () =>
        addLine(`Education
--------------------------------------------------------------------------------
B.Tech in Computer Engineering (Cyber Security)
Ganpat University, ICT | 2022 - 2025

Diploma in Computer Engineering
Ganpat University, IoT | 2019 - 2022`),
      certifications: () =>
        addLine(`Certifications
--------------------------------------------------------------------------------
- Google Cloud Skills Boost labs and skill badges
- Unity Essentials Pathway
- Postman API Fundamentals Student Expert
- DataCamp Python and SQL courses
- Deloitte Australia Cyber Job Simulation`),
      leadership: () =>
        addLine(`Leadership & Activities
--------------------------------------------------------------------------------
- Collaborative team contributor in QA and development workflows.
- Experience supporting technical lab setup and cybersecurity practice environments.`),
      sudo: () =>
        addLine(`[sudo] password for Geet:

Access Denied!

Just kidding. You don't need sudo privileges to explore my portfolio.`),
      clear: clearTerminal,
      whoami: () => addLine('Geet Prajapati'),
      ls: () => addLine('projects/  skills/  experience/  about.txt  contact.txt  resume.pdf'),
      pwd: () => addLine('/home/Geet/portfolio'),
      date: () => addLine(new Date().toString()),
      echo: () => addLine(args.join(' ')),
      exit: () => addLine('Browser security may block closing this tab. Goodbye!', 'info'),
    }

    if (commands[command]) commands[command]()
    else addLine(`Command not found: ${command}. Type 'help' for available commands.`, 'error')
  }

  const submitCommand = () => {
    const value = input.trim()
    if (!value) return
    executeCommand(value)
    setHistory((current) => [value, ...current])
    setHistoryIndex(-1)
    setInput('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submitCommand()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex])
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (event.key === 'Tab') {
      event.preventDefault()
      const allCommands = ['system online', 'system offline', 'help', 'about', 'projects', 'skills', 'experience', 'contact', 'education', 'certifications', 'leadership', 'sudo', 'clear', 'whoami', 'ls', 'pwd', 'date', 'echo', 'exit']
      const matches = allCommands.filter((cmd) => cmd.startsWith(input.toLowerCase()))
      if (matches.length === 1) setInput(matches[0])
      else if (matches.length > 1) addLine(`Available commands: ${matches.join(', ')}`)
    }
  }

  return (
    <div className={`container ${isOnline ? 'online' : 'offline'}`} onClick={() => inputRef.current?.focus()}>
      <header className="header">
        <div className="header-left">
          <h1 className="name">Geet Prajapati</h1>
          <p className="title">Computer Engineer</p>
        </div>
        <div className="header-right">
          <span className="timestamp">{timestamp}</span>
          <span className="system-status">System: {isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </header>

      <div className="main-content">
        <aside className="left-panel">
          <div className="id-card-stage">
            <Canvas camera={{ position: [0, 0, 13], fov: 25 }} dpr={[1, 2]}>
              <ambientLight intensity={Math.PI} />
              <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                <Band />
              </Physics>
              <Environment background blur={0.75}>
                <color attach="background" args={['#050505']} />
                <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={3} color="#dbeafe" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={3} color="#ecfeff" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
              </Environment>
            </Canvas>
            <span className="drag-hint">Drag ID card</span>
          </div>
        </aside>

        <main className="right-panel">
          <section className="terminal">
            <div className="terminal-header">
              <div className="terminal-controls">
                <span className="control close"></span>
                <span className="control minimize"></span>
                <span className="control maximize"></span>
              </div>
            </div>
            <div className="terminal-body">
              <nav className="nav-menu" aria-label="Terminal commands">
                {commandLinks.map((command, index) => (
                  <span key={command}>
                    <button className="command-link" type="button" onClick={(event) => {
                      event.stopPropagation()
                      executeCommand(command)
                    }}>
                      {command}
                    </button>
                    {index < commandLinks.length - 1 && <span className="separator">|</span>}
                  </span>
                ))}
              </nav>

              <div className="terminal-output" ref={outputRef}>
                {lines.map((line, index) => (
                  <pre className={`output-line ${line.className || ''}`} key={`${line.text}-${index}`}>
                    {line.text}
                  </pre>
                ))}
              </div>

              <div className="terminal-input">
                <span className="prompt">Geet@portfolio:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  className="input-field"
                  autoComplete="off"
                  spellCheck="false"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <span>{isOnline ? 'System is Online and ready to use, enjoy!' : "System is Offline, please type 'system online' to go online"}</span>
          <div className="footer-text">
            <p>&copy; 2024 Geet Prajapati. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef()
  const fixed = useRef()
  const j1 = useRef()
  const j2 = useRef()
  const j3 = useRef()
  const card = useRef()
  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }
  const { nodes, materials } = useGLTF(CARD_MODEL)
  const texture = useTexture(BAND_TEXTURE)
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = dragged ? 'grabbing' : 'grab'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    }

    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })

      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))

      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(event) => {
              event.target.releasePointerCapture(event.pointerId)
              drag(false)
            }}
            onPointerDown={(event) => {
              event.target.setPointerCapture(event.pointerId)
              drag(new THREE.Vector3().copy(event.point).sub(vec.copy(card.current.translation())))
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial map={materials.base.map} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            <CardText />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[width, height]} useMap map={texture} repeat={[-3, 1]} lineWidth={1} />
      </mesh>
    </>
  )
}

function CardText() {
  return (
    <group position={[0, -0.02, 0.028]}>
      <Text position={[0, 0.34, 0]} fontSize={0.085} color="#111827" anchorX="center" anchorY="middle">
        GEET PRAJAPATI
      </Text>
      <Text position={[0, 0.2, 0]} fontSize={0.044} color="#334155" anchorX="center" anchorY="middle">
        COMPUTER ENGINEER / QA TESTER
      </Text>
      <Text position={[0, -0.03, 0]} fontSize={0.038} color="#111827" anchorX="center" anchorY="middle">
        Cybersecurity | Game Testing | Frontend
      </Text>
      <Text position={[0, -0.22, 0]} fontSize={0.034} color="#475569" anchorX="center" anchorY="middle">
        Ahmedabad, Gujarat, India
      </Text>
    </group>
  )
}
