export const enhancedUserKernelMode = {
  id: 'user-kernel-mode',
  title: 'User Mode vs Kernel Mode',
  subtitle: 'CPU Privilege Levels and System Protection',
  
  summary: 'User mode and kernel mode are two distinct CPU execution modes providing different privilege levels. User mode restricts access to critical system resources, while kernel mode grants full hardware access. This separation is fundamental to system security, stability, and resource protection.',
  
  analogy: 'Think of a hospital: User mode is like visitors who can only access public areas (waiting rooms, cafeteria) and must ask staff for help. Kernel mode is like doctors who have full access to operating rooms, medical equipment, and patient records. This separation protects critical resources and ensures only authorized personnel handle sensitive operations.',
  
  explanation: `User mode and kernel mode represent different privilege levels in modern processors, forming the foundation of operating system security and stability.

WHAT ARE CPU MODES?

Modern processors support multiple privilege levels (also called protection rings). Most systems use two primary modes:

USER MODE (Ring 3):
- Restricted execution environment
- Limited instruction set
- No direct hardware access
- Cannot execute privileged instructions
- Memory access restricted to user space
- Applications run in this mode
- Provides isolation and protection

KERNEL MODE (Ring 0):
- Privileged execution environment
- Full instruction set access
- Direct hardware manipulation
- Can execute all CPU instructions
- Access to all memory regions
- Operating system kernel runs here
- Complete system control

WHY TWO MODES?

1. SECURITY - Prevents malicious programs from damaging system
2. STABILITY - Isolates application crashes from system
3. RESOURCE PROTECTION - Controls access to hardware
4. MEMORY PROTECTION - Prevents unauthorized memory access
5. CONTROLLED INTERFACE - System calls provide safe access

MODE SWITCHING:

User to Kernel Mode (Privilege Escalation):
- System calls (software interrupts)
- Hardware interrupts
- Exceptions (page faults, divide by zero)
- Automatic privilege elevation
- Context saved before switch

Kernel to User Mode (Privilege Reduction):
- Return from system call
- Return from interrupt handler
- Process scheduling
- Explicit mode change instruction
- Context restored after switch`,

  keyPoints: [
    'User mode: restricted access, applications run here, Ring 3 privilege level',
    'Kernel mode: full access, OS kernel runs here, Ring 0 privilege level',
    'Mode switching via: system calls, interrupts, exceptions',
    'System calls provide controlled interface from user to kernel mode',
    'Mode switch overhead: 100-1000 CPU cycles for context save/restore',
    'Memory divided into: user space (low addresses) and kernel space (high addresses)',
    'Privileged instructions only in kernel mode: I/O, interrupt control, memory management',
    'Protection rings: Ring 0 (kernel), Ring 1-2 (drivers), Ring 3 (user)',
    'Mode bit in CPU status register indicates current mode',
    'Security through isolation: user programs cannot crash system'
  ],

  codeExamples: [{
    title: 'User Mode vs Kernel Mode Complete Implementation',
    description: 'Comprehensive demonstration of mode switching, system calls, privilege levels, and memory protection mechanisms.',
    language: 'java',
    code: `// CPU Mode Representation
class CPUMode {
    enum PrivilegeLevel {
        RING_0_KERNEL(0),    // Highest privilege
        RING_1_DRIVERS(1),   // Device drivers
        RING_2_SERVICES(2),  // System services
        RING_3_USER(3);      // Lowest privilege
        
        private final int level;
        PrivilegeLevel(int level) { this.level = level; }
        public int getLevel() { return level; }
    }
    
    private PrivilegeLevel currentMode;
    private boolean interruptsEnabled;
    
    public CPUMode() {
        this.currentMode = PrivilegeLevel.RING_3_USER;
        this.interruptsEnabled = true;
    }
    
    public boolean isKernelMode() {
        return currentMode == PrivilegeLevel.RING_0_KERNEL;
    }
    
    public boolean isUserMode() {
        return currentMode == PrivilegeLevel.RING_3_USER;
    }
}

// System Call Implementation
class SystemCallHandler {
    private CPUMode cpuMode;
    private MemoryManager memoryManager;
    
    // System call numbers
    private static final int SYS_READ = 0;
    private static final int SYS_WRITE = 1;
    private static final int SYS_OPEN = 2;
    private static final int SYS_CLOSE = 3;
    private static final int SYS_FORK = 4;
    
    public int handleSystemCall(int syscallNumber, Object[] parameters) {
        // STEP 1: Save user mode context
        UserContext savedContext = saveUserContext();
        
        // STEP 2: Switch to kernel mode
        switchToKernelMode();
        
        // STEP 3: Validate parameters (security check)
        if (!validateParameters(syscallNumber, parameters)) {
            switchToUserMode();
            restoreUserContext(savedContext);
            return -1; // EINVAL
        }
        
        // STEP 4: Execute system call in kernel mode
        int result;
        switch (syscallNumber) {
            case SYS_READ:
                result = kernelRead((int)parameters[0], 
                                  (byte[])parameters[1], 
                                  (int)parameters[2]);
                break;
            case SYS_WRITE:
                result = kernelWrite((int)parameters[0], 
                                   (byte[])parameters[1], 
                                   (int)parameters[2]);
                break;
            case SYS_OPEN:
                result = kernelOpen((String)parameters[0], 
                                  (int)parameters[1]);
                break;
            case SYS_FORK:
                result = kernelFork();
                break;
            default:
                result = -1; // ENOSYS
        }
        
        // STEP 5: Switch back to user mode
        switchToUserMode();
        
        // STEP 6: Restore user context
        restoreUserContext(savedContext);
        
        return result;
    }
    
    private void switchToKernelMode() {
        cpuMode.setMode(PrivilegeLevel.RING_0_KERNEL);
        switchToKernelStack();
        disableInterrupts(); // Critical section
    }
    
    private void switchToUserMode() {
        enableInterrupts();
        switchToUserStack();
        cpuMode.setMode(PrivilegeLevel.RING_3_USER);
    }
}

// Memory Protection
class MemoryProtection {
    private static final long USER_SPACE_START = 0x00000000L;
    private static final long USER_SPACE_END = 0x7FFFFFFFL;
    private static final long KERNEL_SPACE_START = 0x80000000L;
    private static final long KERNEL_SPACE_END = 0xFFFFFFFFL;
    
    public boolean canAccess(long address, CPUMode mode) {
        if (mode.isKernelMode()) {
            return true; // Kernel can access everything
        }
        
        // User mode can only access user space
        return address >= USER_SPACE_START && 
               address <= USER_SPACE_END;
    }
    
    public void checkMemoryAccess(long address, CPUMode mode) {
        if (!canAccess(address, mode)) {
            throw new SegmentationFaultException(
                "Access violation at address: 0x" + 
                Long.toHexString(address));
        }
    }
}

// Privileged Instructions
class PrivilegedInstructions {
    
    // I/O Port Access (Kernel Mode Only)
    public void outb(int port, byte value) {
        if (!cpuMode.isKernelMode()) {
            throw new GeneralProtectionFault(
                "I/O instruction requires kernel mode");
        }
        // Write byte to I/O port
        hardwareWritePort(port, value);
    }
    
    public byte inb(int port) {
        if (!cpuMode.isKernelMode()) {
            throw new GeneralProtectionFault(
                "I/O instruction requires kernel mode");
        }
        // Read byte from I/O port
        return hardwareReadPort(port);
    }
    
    // Interrupt Control (Kernel Mode Only)
    public void cli() { // Clear Interrupts
        if (!cpuMode.isKernelMode()) {
            throw new GeneralProtectionFault(
                "CLI requires kernel mode");
        }
        disableInterrupts();
    }
    
    public void sti() { // Set Interrupts
        if (!cpuMode.isKernelMode()) {
            throw new GeneralProtectionFault(
                "STI requires kernel mode");
        }
        enableInterrupts();
    }
    
    // Load Page Table Register (Kernel Mode Only)
    public void loadCR3(long pageTableAddress) {
        if (!cpuMode.isKernelMode()) {
            throw new GeneralProtectionFault(
                "CR3 load requires kernel mode");
        }
        setPageTableBaseRegister(pageTableAddress);
    }
    
    // Halt CPU (Kernel Mode Only)
    public void hlt() {
        if (!cpuMode.isKernelMode()) {
            throw new GeneralProtectionFault(
                "HLT requires kernel mode");
        }
        haltProcessor();
    }
}

// Mode Switch Overhead Measurement
class ModeSwitchBenchmark {
    
    public void measureSystemCallOverhead() {
        long startTime = System.nanoTime();
        
        // Perform simple system call (getpid)
        int pid = systemCall(SYS_GETPID);
        
        long endTime = System.nanoTime();
        long overhead = endTime - startTime;
        
        System.out.println("System call overhead: " + 
                         overhead + " nanoseconds");
        // Typical: 100-1000 nanoseconds (100-1000 CPU cycles)
    }
    
    public void compareUserVsKernelOperations() {
        // User mode operation (no mode switch)
        long userStart = System.nanoTime();
        int sum = 0;
        for (int i = 0; i < 1000; i++) {
            sum += i;
        }
        long userEnd = System.nanoTime();
        
        // Kernel mode operation (requires mode switch)
        long kernelStart = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            systemCall(SYS_GETPID); // Mode switch each time
        }
        long kernelEnd = System.nanoTime();
        
        System.out.println("User mode: " + 
                         (userEnd - userStart) + " ns");
        System.out.println("Kernel mode: " + 
                         (kernelEnd - kernelStart) + " ns");
        System.out.println("Overhead per syscall: " + 
                         ((kernelEnd - kernelStart) / 1000) + " ns");
    }
}

// Interrupt Handling
class InterruptHandler {
    
    public void handleInterrupt(int interruptNumber) {
        // AUTOMATIC mode switch to kernel mode by hardware
        
        // Save interrupted context
        InterruptContext context = saveInterruptContext();
        
        // Disable interrupts (prevent nested interrupts)
        disableInterrupts();
        
        // Determine interrupt source
        switch (interruptNumber) {
            case TIMER_INTERRUPT:
                handleTimerInterrupt();
                break;
            case KEYBOARD_INTERRUPT:
                handleKeyboardInterrupt();
                break;
            case PAGE_FAULT:
                handlePageFault();
                break;
            default:
                handleUnknownInterrupt(interruptNumber);
        }
        
        // Re-enable interrupts
        enableInterrupts();
        
        // Restore context and return to previous mode
        restoreInterruptContext(context);
        
        // IRET instruction returns to previous mode
    }
}

// Security Implications
class SecurityModel {
    
    // User mode cannot:
    // - Access hardware directly
    // - Modify page tables
    // - Disable interrupts
    // - Access kernel memory
    // - Execute privileged instructions
    // - Bypass file permissions
    
    // Kernel mode can:
    // - Access all memory
    // - Execute all instructions
    // - Control hardware
    // - Modify system state
    // - Override security checks
    
    public void demonstrateSecurity() {
        // User mode attempt to access hardware
        try {
            outb(0x3F8, (byte)0x41); // Write to serial port
        } catch (GeneralProtectionFault e) {
            System.out.println("Security violation prevented!");
        }
        
        // Proper way: use system call
        int fd = systemCall(SYS_OPEN, "/dev/ttyS0", O_WRONLY);
        systemCall(SYS_WRITE, fd, "A".getBytes(), 1);
        systemCall(SYS_CLOSE, fd);
    }
}`
  }],

  resources: [
    { 
      title: 'Intel Software Developer Manual - Protection', 
      url: 'https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html',
      description: 'Official Intel documentation on CPU protection rings and privilege levels'
    },
    { 
      title: 'Linux Kernel - System Calls', 
      url: 'https://www.kernel.org/doc/html/latest/process/adding-syscalls.html',
      description: 'Linux kernel documentation on system call implementation'
    },
    { 
      title: 'OSDev Wiki - CPU Modes', 
      url: 'https://wiki.osdev.org/CPU_Modes',
      description: 'Comprehensive guide to CPU modes and privilege levels'
    },
    { 
      title: 'GeeksforGeeks - User Mode vs Kernel Mode', 
      url: 'https://www.geeksforgeeks.org/user-mode-and-kernel-mode-switching/',
      description: 'Clear explanation with examples and diagrams'
    }
  ],

  questions: [
    { 
      question: "What is the difference between user mode and kernel mode?", 
      answer: "User mode: restricted execution with limited instruction set, no direct hardware access, memory restricted to user space, applications run here. Kernel mode: privileged execution with full instruction set, direct hardware access, access to all memory, OS kernel runs here. Separation provides security and stability." 
    },
    { 
      question: "How does mode switching occur and what triggers it?", 
      answer: "User to kernel: system calls (software interrupt), hardware interrupts, exceptions (page faults). Kernel to user: return from system call/interrupt, process scheduling. Process: save context, change privilege level, switch stacks, execute operation, restore context. Overhead: 100-1000 CPU cycles." 
    },
    { 
      question: "What are privileged instructions and why are they restricted?", 
      answer: "Privileged instructions: I/O port access (IN/OUT), interrupt control (CLI/STI), page table loading (MOV CR3), halt (HLT), memory management. Restricted to kernel mode because they can: compromise security, crash system, bypass protection, access hardware directly, modify critical system state." 
    },
    { 
      question: "Explain the x86 protection ring architecture.", 
      answer: "Ring 0 (kernel): highest privilege, full hardware access, OS kernel. Ring 1-2 (drivers/services): intermediate privilege, device drivers. Ring 3 (user): lowest privilege, applications. Most systems use only Ring 0 and Ring 3. Hardware enforces privilege checks on memory access and instruction execution." 
    },
    { 
      question: "How does memory protection work between modes?", 
      answer: "Memory divided into user space (0x00000000-0x7FFFFFFF) and kernel space (0x80000000-0xFFFFFFFF). User mode can only access user space, kernel mode accesses all. Page tables have privilege bits. Hardware MMU checks privilege on every memory access, generates fault if violation." 
    },
    { 
      question: "What is the overhead of mode switching?", 
      answer: "Overhead: 100-1000 CPU cycles (100-1000 nanoseconds). Includes: saving registers, switching stacks, changing privilege level, parameter validation, TLB flush (sometimes), cache effects. Minimized by: batching system calls, using user-level libraries, memory-mapped I/O, fast system call instructions (SYSENTER/SYSEXIT)." 
    },
    { 
      question: "How do system calls provide controlled access to kernel mode?", 
      answer: "System calls are controlled entry points: user program invokes software interrupt (INT 0x80 or SYSCALL), hardware switches to kernel mode automatically, kernel validates parameters, executes privileged operation, returns result to user mode. Provides security by: validating all inputs, enforcing permissions, preventing direct hardware access." 
    },
    { 
      question: "What happens during an interrupt in terms of mode switching?", 
      answer: "Hardware automatically switches to kernel mode on interrupt: saves current context (PC, flags, stack pointer), disables interrupts, loads interrupt handler address, switches to kernel stack. Handler executes in kernel mode. IRET instruction restores context and returns to previous mode. Critical for handling hardware events." 
    },
    { 
      question: "Why can't user mode programs access hardware directly?", 
      answer: "Security and stability reasons: prevent malicious programs from damaging hardware, avoid conflicts between programs accessing same device, enforce resource sharing policies, maintain system stability, enable proper error handling. User programs must use system calls, which validate requests and coordinate access." 
    },
    { 
      question: "How do modern processors optimize mode switching?", 
      answer: "Optimizations: fast system call instructions (SYSENTER/SYSEXIT, SYSCALL/SYSRET), separate kernel stacks per CPU, TLB tagging to avoid flush, PCID for address space identification, user-level interrupt handling, memory-mapped I/O, vDSO for frequently-used calls. Reduces overhead from 1000+ cycles to ~100 cycles." 
    }
  ]
};
