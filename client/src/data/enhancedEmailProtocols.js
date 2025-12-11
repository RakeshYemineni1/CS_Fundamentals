export const enhancedEmailProtocols = {
  id: 'email-protocols',
  title: 'FTP, SMTP, POP3, IMAP',
  subtitle: 'File Transfer and Email Communication Protocols',
  summary: 'FTP transfers files between systems, SMTP sends emails, POP3 downloads emails to local storage, and IMAP synchronizes emails across multiple devices with server-side storage.',
  analogy: 'Like postal services: FTP is a courier service for packages, SMTP is sending mail, POP3 is a P.O. box you empty completely, IMAP is a shared mailbox everyone can access.',
  visualConcept: 'Picture different communication channels: FTP as file highways, SMTP as outgoing mail trucks, POP3 as one-way download pipes, IMAP as two-way synchronized connections.',
  realWorldUse: 'File transfers, email systems, web hosting, backup solutions, content management, and any application requiring reliable data transfer or messaging.',
  explanation: `Email and File Transfer Protocols:

FTP (File Transfer Protocol) enables reliable file transfer between systems using separate control and data connections. It supports both active and passive modes to handle firewall restrictions.

SMTP (Simple Mail Transfer Protocol) handles email transmission from clients to servers and between mail servers. It's a push protocol that delivers messages to recipients' mail servers.

POP3 (Post Office Protocol v3) downloads emails from server to client, typically removing them from the server. It's designed for single-device access with offline email management.

IMAP (Internet Message Access Protocol) keeps emails on the server while allowing multiple clients to access and synchronize. It supports folders, search, and partial message downloads for efficient bandwidth usage.`,

  keyPoints: [
    'FTP uses separate control (21) and data connections for file transfer',
    'SMTP sends emails using port 25/587 with authentication',
    'POP3 downloads emails to client, removing from server',
    'IMAP synchronizes emails across devices, keeping server copies',
    'FTP supports both active and passive connection modes',
    'SMTP works with POP3/IMAP for complete email systems',
    'IMAP allows server-side search and folder management',
    'All protocols support secure variants (FTPS, SMTPS, POP3S, IMAPS)',
    'Authentication mechanisms vary by protocol and security needs',
    'Each protocol optimized for specific use cases and workflows'
  ],

  codeExamples: [
    {
      title: "Protocol Overview and Comparison",
      content: `
        <h3>Protocol Characteristics Comparison</h3>
        <p>Understanding the key differences and use cases for each protocol.</p>
        
        <div class="code-block">
          <h4>Protocol Comparison Matrix</h4>
          <pre><code>Protocol | Port(s)    | Purpose           | Connection Type | Data Storage
---------|------------|-------------------|-----------------|------------------
FTP      | 21, 20     | File Transfer     | TCP            | Client/Server
FTPS     | 21, 990    | Secure FTP        | TCP over TLS   | Client/Server
SFTP     | 22         | SSH File Transfer | TCP over SSH   | Client/Server
SMTP     | 25, 587    | Send Email        | TCP            | Server to Server
SMTPS    | 465, 587   | Secure SMTP       | TCP over TLS   | Server to Server
POP3     | 110        | Download Email    | TCP            | Client (offline)
POP3S    | 995        | Secure POP3       | TCP over TLS   | Client (offline)
IMAP     | 143        | Sync Email        | TCP            | Server (online)
IMAPS    | 993        | Secure IMAP       | TCP over TLS   | Server (online)</code></pre>
        </div>

        <h4>Use Case Scenarios:</h4>
        
        <div class="code-block">
          <h4>When to Use Each Protocol</h4>
          <pre><code>FTP - File Transfer Protocol:
✓ Website file uploads/downloads
✓ Backup and archival systems
✓ Large file distribution
✓ Legacy system integration
✗ Not secure by default
✗ Firewall complications (active mode)

SMTP - Simple Mail Transfer Protocol:
✓ Sending emails from applications
✓ Email server communication
✓ Automated notifications
✓ Mailing list systems
✗ Only for sending (not receiving)
✗ Requires authentication for security

POP3 - Post Office Protocol v3:
✓ Single device email access
✓ Limited server storage
✓ Offline email reading
✓ Simple email clients
✗ No synchronization across devices
✗ Limited server-side features

IMAP - Internet Message Access Protocol:
✓ Multiple device synchronization
✓ Server-side email management
✓ Collaborative email access
✓ Advanced search capabilities
✗ Requires constant internet connection
✗ Higher server storage requirements</code></pre>
        </div>

        <h4>Email System Architecture:</h4>
        
        <div class="code-block">
          <h4>Complete Email Flow</h4>
          <pre><code>Email Sending Process (SMTP):
1. User composes email in client (Outlook, Gmail, etc.)
2. Client connects to SMTP server (smtp.gmail.com:587)
3. Client authenticates with username/password
4. Client sends email via SMTP commands
5. SMTP server routes email to recipient's mail server
6. Recipient's server stores email in mailbox

Email Receiving Process (POP3):
1. Client connects to POP3 server (pop.gmail.com:995)
2. Client authenticates
3. Client downloads all emails
4. Emails deleted from server (optional)
5. Client disconnects

Email Receiving Process (IMAP):
1. Client connects to IMAP server (imap.gmail.com:993)
2. Client authenticates
3. Client synchronizes folder structure
4. Client downloads headers/previews
5. Full messages downloaded on demand
6. Changes synchronized back to server</code></pre>
        </div>
      `
    },
    
    {
      title: "FTP Protocol Implementation",
      content: `
        <h3>FTP (File Transfer Protocol)</h3>
        <p>FTP uses two connections: control connection for commands and data connection for file transfers.</p>
        
        <div class="code-block">
          <h4>FTP Connection Modes</h4>
          <pre><code>Active Mode FTP:
1. Client connects to server port 21 (control connection)
2. Client sends PORT command with IP:port for data connection
3. Server connects back to client's specified port
4. Data transfer occurs on server-initiated connection

Problems with Active Mode:
- Client firewall blocks incoming connections
- NAT routers don't forward connections properly
- Security concerns with server connecting to client

Passive Mode FTP:
1. Client connects to server port 21 (control connection)
2. Client sends PASV command
3. Server responds with IP:port for data connection
4. Client connects to server's data port
5. Data transfer occurs on client-initiated connection

PASV Response Example:
227 Entering Passive Mode (192,168,1,100,20,21)
IP: 192.168.1.100
Port: 20*256 + 21 = 5141</code></pre>
        </div>

        <div class="code-block">
          <h4>FTP Command Sequence</h4>
          <pre><code>Typical FTP Session:
Client → Server: USER username
Server → Client: 331 Password required
Client → Server: PASS password
Server → Client: 230 Login successful

Client → Server: PWD
Server → Client: 257 "/" is current directory

Client → Server: LIST
Server → Client: 150 Opening data connection
Server → Client: [directory listing via data connection]
Server → Client: 226 Transfer complete

Client → Server: CWD /uploads
Server → Client: 250 Directory changed

Client → Server: TYPE I (binary mode)
Server → Client: 200 Type set to I

Client → Server: PASV
Server → Client: 227 Entering Passive Mode (192,168,1,100,20,21)

Client → Server: STOR filename.txt
Server → Client: 150 Opening data connection
Client → Server: [file data via data connection]
Server → Client: 226 Transfer complete

Client → Server: QUIT
Server → Client: 221 Goodbye</code></pre>
        </div>

        <h4>FTP Security Considerations:</h4>
        <ul>
          <li><strong>Plain FTP:</strong> Unencrypted, passwords visible</li>
          <li><strong>FTPS:</strong> FTP over SSL/TLS encryption</li>
          <li><strong>SFTP:</strong> SSH File Transfer Protocol (different from FTP)</li>
          <li><strong>Firewall Issues:</strong> Passive mode recommended</li>
        </ul>
      `
    },
    
    {
      title: "SMTP Protocol Implementation",
      content: `
        <h3>SMTP (Simple Mail Transfer Protocol)</h3>
        <p>SMTP handles email transmission with a command-response model.</p>
        
        <div class="code-block">
          <h4>SMTP Session Example</h4>
          <pre><code>Basic SMTP Transaction:
Client → Server: EHLO client.example.com
Server → Client: 250-smtp.gmail.com at your service
                 250-SIZE 35882577
                 250-8BITMIME
                 250-STARTTLS
                 250-ENHANCEDSTATUSCODES
                 250 CHUNKING

Client → Server: STARTTLS
Server → Client: 220 Ready to start TLS

[TLS negotiation occurs]

Client → Server: EHLO client.example.com
Server → Client: 250-smtp.gmail.com at your service
                 250-SIZE 35882577
                 250-8BITMIME
                 250-AUTH LOGIN PLAIN XOAUTH2
                 250 ENHANCEDSTATUSCODES

Client → Server: AUTH LOGIN
Server → Client: 334 VXNlcm5hbWU6 (base64 "Username:")
Client → Server: dXNlckBleGFtcGxlLmNvbQ== (base64 encoded username)
Server → Client: 334 UGFzc3dvcmQ6 (base64 "Password:")
Client → Server: cGFzc3dvcmQ= (base64 encoded password)
Server → Client: 235 Authentication successful

Client → Server: MAIL FROM:<sender@example.com>
Server → Client: 250 OK

Client → Server: RCPT TO:<recipient@example.com>
Server → Client: 250 OK

Client → Server: DATA
Server → Client: 354 Start mail input; end with <CRLF>.<CRLF>

Client → Server: From: sender@example.com
                 To: recipient@example.com
                 Subject: Test Email
                 
                 This is the email body.
                 .
Server → Client: 250 OK Message accepted

Client → Server: QUIT
Server → Client: 221 Bye</code></pre>
        </div>

        <div class="code-block">
          <h4>SMTP Authentication Methods</h4>
          <pre><code>1. LOGIN Authentication:
   - Username and password in base64
   - Simple but less secure
   - Widely supported

2. PLAIN Authentication:
   - Username/password in single base64 string
   - Format: \\0username\\0password
   - Simple implementation

3. CRAM-MD5 Authentication:
   - Challenge-response mechanism
   - Password never sent in plain text
   - More secure than LOGIN/PLAIN

4. OAUTH2 Authentication:
   - Token-based authentication
   - No password storage required
   - Modern secure method
   - Used by Gmail, Outlook

Example OAUTH2:
Client → Server: AUTH XOAUTH2 dXNlcj1zb21ldXNlckBleGFtcGxlLmNvbQFhdXRoPUJlYXJlciB5YTI5LnZGOWRmdDRxbVRjMk52YjNSbGNrQmhkSFJoZG1semRHRXVZMjl0Q2c9PQEB
Server → Client: 235 Authentication successful</code></pre>
        </div>

        <h4>SMTP Response Codes:</h4>
        <ul>
          <li><strong>2xx:</strong> Success (250 OK, 221 Bye)</li>
          <li><strong>3xx:</strong> Intermediate (354 Start mail input)</li>
          <li><strong>4xx:</strong> Temporary failure (450 Mailbox busy)</li>
          <li><strong>5xx:</strong> Permanent failure (550 User unknown)</li>
        </ul>
      `
    },
    
    {
      title: "POP3 vs IMAP Comparison",
      content: `
        <h3>POP3 (Post Office Protocol v3)</h3>
        <p>POP3 downloads emails from server to client for offline access.</p>
        
        <div class="code-block">
          <h4>POP3 Session Example</h4>
          <pre><code>POP3 Transaction:
Client → Server: USER john@example.com
Server → Client: +OK User accepted

Client → Server: PASS secretpassword
Server → Client: +OK Mailbox ready

Client → Server: STAT
Server → Client: +OK 3 1024 (3 messages, 1024 bytes total)

Client → Server: LIST
Server → Client: +OK 3 messages
                 1 512
                 2 256
                 3 256
                 .

Client → Server: RETR 1
Server → Client: +OK 512 bytes
                 [email message content]
                 .

Client → Server: DELE 1
Server → Client: +OK Message deleted

Client → Server: QUIT
Server → Client: +OK Goodbye</code></pre>
        </div>

        <h3>IMAP (Internet Message Access Protocol)</h3>
        <p>IMAP keeps emails on server with synchronization across multiple clients.</p>
        
        <div class="code-block">
          <h4>IMAP Session Example</h4>
          <pre><code>IMAP Transaction:
Client → Server: A001 LOGIN john@example.com secretpassword
Server → Client: A001 OK LOGIN completed

Client → Server: A002 LIST "" "*"
Server → Client: * LIST (\\HasNoChildren) "/" INBOX
                 * LIST (\\HasChildren) "/" "Sent Items"
                 * LIST (\\HasNoChildren) "/" "Sent Items/2024"
                 A002 OK LIST completed

Client → Server: A003 SELECT INBOX
Server → Client: * 3 EXISTS
                 * 0 RECENT
                 * OK [UIDVALIDITY 1234567890] UIDs valid
                 * FLAGS (\\Answered \\Flagged \\Deleted \\Seen \\Draft)
                 A003 OK [READ-WRITE] SELECT completed

Client → Server: A004 FETCH 1:3 (FLAGS ENVELOPE)
Server → Client: * 1 FETCH (FLAGS (\\Seen) ENVELOPE (...))
                 * 2 FETCH (FLAGS () ENVELOPE (...))
                 * 3 FETCH (FLAGS (\\Flagged) ENVELOPE (...))
                 A004 OK FETCH completed

Client → Server: A005 FETCH 2 BODY[]
Server → Client: * 2 FETCH (BODY[] {256}
                 [full email message]
                 )
                 A005 OK FETCH completed

Client → Server: A006 STORE 2 +FLAGS (\\Seen)
Server → Client: * 2 FETCH (FLAGS (\\Seen))
                 A006 OK STORE completed

Client → Server: A007 LOGOUT
Server → Client: * BYE IMAP server logging out
                 A007 OK LOGOUT completed</code></pre>
        </div>

        <div class="code-block">
          <h4>POP3 vs IMAP Feature Comparison</h4>
          <pre><code>Feature                    | POP3              | IMAP
---------------------------|-------------------|------------------
Email Storage             | Client            | Server
Multiple Device Access    | No                | Yes
Offline Access            | Yes (after download) | Partial
Server Storage Usage      | Minimal           | High
Folder Management         | Client-side only  | Server-side
Search Capabilities       | Client-side only  | Server-side
Partial Message Download  | No                | Yes
Synchronization          | None              | Full sync
Bandwidth Usage          | High (full download) | Optimized
Connection Requirements   | Brief             | Persistent/Frequent

POP3 Workflow:
1. Connect → 2. Download All → 3. Delete from Server → 4. Disconnect

IMAP Workflow:
1. Connect → 2. Sync Headers → 3. Download on Demand → 4. Sync Changes</code></pre>
        </div>

        <h4>Choosing Between POP3 and IMAP:</h4>
        <ul>
          <li><strong>Use POP3 when:</strong> Single device, limited server storage, offline access needed</li>
          <li><strong>Use IMAP when:</strong> Multiple devices, collaborative access, server-side management needed</li>
        </ul>
      `
    }
  ],

  codeExamples: [
    {
      title: "Email Client Implementation",
      language: "python",
      code: `import smtplib
import poplib
import imaplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl

class EmailClient:
    def __init__(self):
        self.smtp_server = None
        self.pop_server = None
        self.imap_server = None
    
    # SMTP - Sending Emails
    def send_email_smtp(self, smtp_host, smtp_port, username, password, 
                       to_email, subject, body, use_tls=True):
        """Send email using SMTP"""
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = username
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            
            # Connect to SMTP server
            if use_tls:
                server = smtplib.SMTP(smtp_host, smtp_port)
                server.starttls()  # Enable TLS encryption
            else:
                server = smtplib.SMTP_SSL(smtp_host, smtp_port)
            
            # Login and send
            server.login(username, password)
            server.send_message(msg)
            server.quit()
            
            print(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"SMTP Error: {e}")
            return False
    
    # POP3 - Receiving Emails (Download and Delete)
    def receive_emails_pop3(self, pop_host, pop_port, username, password, 
                           use_ssl=True, delete_after_download=False):
        """Receive emails using POP3"""
        
        try:
            # Connect to POP3 server
            if use_ssl:
                server = poplib.POP3_SSL(pop_host, pop_port)
            else:
                server = poplib.POP3(pop_host, pop_port)
            
            # Login
            server.user(username)
            server.pass_(password)
            
            # Get mailbox info
            num_messages = len(server.list()[1])
            print(f"POP3: {num_messages} messages in mailbox")
            
            emails = []
            
            # Download each message
            for i in range(1, num_messages + 1):
                # Get message
                raw_email = b"\\n".join(server.retr(i)[1])
                email_message = email.message_from_bytes(raw_email)
                
                # Extract email info
                email_info = {
                    'subject': email_message['Subject'],
                    'from': email_message['From'],
                    'date': email_message['Date'],
                    'body': self._extract_body(email_message)
                }
                
                emails.append(email_info)
                print(f"Downloaded: {email_info['subject']}")
                
                # Delete from server if requested
                if delete_after_download:
                    server.dele(i)
                    print(f"Deleted message {i} from server")
            
            server.quit()
            return emails
            
        except Exception as e:
            print(f"POP3 Error: {e}")
            return []
    
    # IMAP - Receiving Emails (Server Synchronization)
    def receive_emails_imap(self, imap_host, imap_port, username, password, 
                           folder='INBOX', use_ssl=True, limit=10):
        """Receive emails using IMAP"""
        
        try:
            # Connect to IMAP server
            if use_ssl:
                server = imaplib.IMAP4_SSL(imap_host, imap_port)
            else:
                server = imaplib.IMAP4(imap_host, imap_port)
            
            # Login
            server.login(username, password)
            
            # List folders
            folders = server.list()
            print("Available folders:")
            for folder_info in folders[1]:
                print(f"  {folder_info.decode()}")
            
            # Select folder
            server.select(folder)
            
            # Search for emails
            status, messages = server.search(None, 'ALL')
            email_ids = messages[0].split()
            
            print(f"IMAP: {len(email_ids)} messages in {folder}")
            
            emails = []
            
            # Get recent emails (limited)
            recent_ids = email_ids[-limit:] if len(email_ids) > limit else email_ids
            
            for email_id in recent_ids:
                # Fetch email
                status, msg_data = server.fetch(email_id, '(RFC822)')
                raw_email = msg_data[0][1]
                email_message = email.message_from_bytes(raw_email)
                
                # Extract email info
                email_info = {
                    'id': email_id.decode(),
                    'subject': email_message['Subject'],
                    'from': email_message['From'],
                    'date': email_message['Date'],
                    'body': self._extract_body(email_message)
                }
                
                emails.append(email_info)
                print(f"Fetched: {email_info['subject']}")
            
            server.close()
            server.logout()
            return emails
            
        except Exception as e:
            print(f"IMAP Error: {e}")
            return []
    
    def _extract_body(self, email_message):
        """Extract email body from message"""
        
        if email_message.is_multipart():
            for part in email_message.walk():
                if part.get_content_type() == "text/plain":
                    return part.get_payload(decode=True).decode()
        else:
            return email_message.get_payload(decode=True).decode()
        
        return "No text content found"
    
    # IMAP Advanced Operations
    def imap_operations(self, imap_host, imap_port, username, password):
        """Demonstrate advanced IMAP operations"""
        
        try:
            server = imaplib.IMAP4_SSL(imap_host, imap_port)
            server.login(username, password)
            
            # Create folder
            server.create('INBOX.TestFolder')
            print("Created folder: INBOX.TestFolder")
            
            # List all folders
            folders = server.list()
            print("\\nAll folders:")
            for folder in folders[1]:
                print(f"  {folder.decode()}")
            
            # Select INBOX
            server.select('INBOX')
            
            # Search for unread emails
            status, unread = server.search(None, 'UNSEEN')
            print(f"\\nUnread emails: {len(unread[0].split()) if unread[0] else 0}")
            
            # Search by subject
            status, subject_search = server.search(None, 'SUBJECT', '"Important"')
            print(f"Emails with 'Important' in subject: {len(subject_search[0].split()) if subject_search[0] else 0}")
            
            # Search by date
            status, date_search = server.search(None, 'SINCE', '01-Jan-2024')
            print(f"Emails since Jan 1, 2024: {len(date_search[0].split()) if date_search[0] else 0}")
            
            # Mark email as read
            if unread[0]:
                email_ids = unread[0].split()
                if email_ids:
                    server.store(email_ids[0], '+FLAGS', '\\\\Seen')
                    print(f"Marked email {email_ids[0].decode()} as read")
            
            # Move email to folder
            if unread[0]:
                email_ids = unread[0].split()
                if email_ids:
                    server.move(email_ids[0], 'INBOX.TestFolder')
                    print(f"Moved email {email_ids[0].decode()} to TestFolder")
            
            server.close()
            server.logout()
            
        except Exception as e:
            print(f"IMAP Operations Error: {e}")

# Example usage
if __name__ == "__main__":
    client = EmailClient()
    
    # Email configuration (replace with actual values)
    smtp_config = {
        'smtp_host': 'smtp.gmail.com',
        'smtp_port': 587,
        'username': 'your-email@gmail.com',
        'password': 'your-app-password'
    }
    
    pop_config = {
        'pop_host': 'pop.gmail.com',
        'pop_port': 995,
        'username': 'your-email@gmail.com',
        'password': 'your-app-password'
    }
    
    imap_config = {
        'imap_host': 'imap.gmail.com',
        'imap_port': 993,
        'username': 'your-email@gmail.com',
        'password': 'your-app-password'
    }
    
    print("Email Client Demo\\n")
    
    # 1. Send email via SMTP
    print("1. Sending email via SMTP...")
    client.send_email_smtp(
        smtp_config['smtp_host'],
        smtp_config['smtp_port'],
        smtp_config['username'],
        smtp_config['password'],
        'recipient@example.com',
        'Test Email from Python',
        'This is a test email sent using Python SMTP client.'
    )
    
    # 2. Receive emails via POP3
    print("\\n2. Receiving emails via POP3...")
    pop_emails = client.receive_emails_pop3(
        pop_config['pop_host'],
        pop_config['pop_port'],
        pop_config['username'],
        pop_config['password'],
        delete_after_download=False
    )
    
    print(f"Retrieved {len(pop_emails)} emails via POP3")
    
    # 3. Receive emails via IMAP
    print("\\n3. Receiving emails via IMAP...")
    imap_emails = client.receive_emails_imap(
        imap_config['imap_host'],
        imap_config['imap_port'],
        imap_config['username'],
        imap_config['password'],
        limit=5
    )
    
    print(f"Retrieved {len(imap_emails)} emails via IMAP")
    
    # 4. Advanced IMAP operations
    print("\\n4. Advanced IMAP operations...")
    client.imap_operations(
        imap_config['imap_host'],
        imap_config['imap_port'],
        imap_config['username'],
        imap_config['password']
    )`
    },
    
    {
      title: "FTP Client Implementation",
      language: "java",
      code: `import java.io.*;
import java.net.*;
import java.util.*;

public class SimpleFTPClient {
    
    private Socket controlSocket;
    private BufferedReader controlReader;
    private PrintWriter controlWriter;
    private String server;
    private int port;
    private boolean connected = false;
    
    public SimpleFTPClient(String server, int port) {
        this.server = server;
        this.port = port;
    }
    
    public boolean connect() {
        try {
            controlSocket = new Socket(server, port);
            controlReader = new BufferedReader(
                new InputStreamReader(controlSocket.getInputStream()));
            controlWriter = new PrintWriter(
                controlSocket.getOutputStream(), true);
            
            String response = readResponse();
            System.out.println("Server: " + response);
            
            if (response.startsWith("220")) {
                connected = true;
                return true;
            }
        } catch (IOException e) {
            System.err.println("Connection failed: " + e.getMessage());
        }
        return false;
    }
    
    public boolean login(String username, String password) {
        if (!connected) return false;
        
        try {
            // Send USER command
            sendCommand("USER " + username);
            String response = readResponse();
            System.out.println("USER response: " + response);
            
            if (response.startsWith("331")) {
                // Send PASS command
                sendCommand("PASS " + password);
                response = readResponse();
                System.out.println("PASS response: " + response);
                
                return response.startsWith("230");
            }
        } catch (IOException e) {
            System.err.println("Login failed: " + e.getMessage());
        }
        return false;
    }
    
    public void listFiles() {
        try {
            // Enter passive mode
            Socket dataSocket = enterPassiveMode();
            if (dataSocket == null) return;
            
            // Send LIST command
            sendCommand("LIST");
            String response = readResponse();
            
            if (response.startsWith("150") || response.startsWith("125")) {
                // Read directory listing
                BufferedReader dataReader = new BufferedReader(
                    new InputStreamReader(dataSocket.getInputStream()));
                
                System.out.println("\\nDirectory listing:");
                String line;
                while ((line = dataReader.readLine()) != null) {
                    System.out.println(line);
                }
                
                dataReader.close();
                dataSocket.close();
                
                // Read completion response
                response = readResponse();
                System.out.println("LIST completed: " + response);
            }
        } catch (IOException e) {
            System.err.println("List failed: " + e.getMessage());
        }
    }
    
    public boolean uploadFile(String localPath, String remoteName) {
        try {
            File localFile = new File(localPath);
            if (!localFile.exists()) {
                System.err.println("Local file not found: " + localPath);
                return false;
            }
            
            // Set binary mode
            sendCommand("TYPE I");
            readResponse();
            
            // Enter passive mode
            Socket dataSocket = enterPassiveMode();
            if (dataSocket == null) return false;
            
            // Send STOR command
            sendCommand("STOR " + remoteName);
            String response = readResponse();
            
            if (response.startsWith("150") || response.startsWith("125")) {
                // Upload file
                FileInputStream fileInput = new FileInputStream(localFile);
                OutputStream dataOutput = dataSocket.getOutputStream();
                
                byte[] buffer = new byte[4096];
                int bytesRead;
                long totalBytes = 0;
                
                System.out.println("Uploading " + localFile.getName() + "...");
                
                while ((bytesRead = fileInput.read(buffer)) != -1) {
                    dataOutput.write(buffer, 0, bytesRead);
                    totalBytes += bytesRead;
                }
                
                fileInput.close();
                dataOutput.close();
                dataSocket.close();
                
                // Read completion response
                response = readResponse();
                System.out.println("Upload completed (" + totalBytes + " bytes): " + response);
                return response.startsWith("226");
            }
        } catch (IOException e) {
            System.err.println("Upload failed: " + e.getMessage());
        }
        return false;
    }
    
    public boolean downloadFile(String remoteName, String localPath) {
        try {
            // Set binary mode
            sendCommand("TYPE I");
            readResponse();
            
            // Enter passive mode
            Socket dataSocket = enterPassiveMode();
            if (dataSocket == null) return false;
            
            // Send RETR command
            sendCommand("RETR " + remoteName);
            String response = readResponse();
            
            if (response.startsWith("150") || response.startsWith("125")) {
                // Download file
                InputStream dataInput = dataSocket.getInputStream();
                FileOutputStream fileOutput = new FileOutputStream(localPath);
                
                byte[] buffer = new byte[4096];
                int bytesRead;
                long totalBytes = 0;
                
                System.out.println("Downloading " + remoteName + "...");
                
                while ((bytesRead = dataInput.read(buffer)) != -1) {
                    fileOutput.write(buffer, 0, bytesRead);
                    totalBytes += bytesRead;
                }
                
                dataInput.close();
                fileOutput.close();
                dataSocket.close();
                
                // Read completion response
                response = readResponse();
                System.out.println("Download completed (" + totalBytes + " bytes): " + response);
                return response.startsWith("226");
            }
        } catch (IOException e) {
            System.err.println("Download failed: " + e.getMessage());
        }
        return false;
    }
    
    private Socket enterPassiveMode() {
        try {
            sendCommand("PASV");
            String response = readResponse();
            
            if (response.startsWith("227")) {
                // Parse PASV response
                int start = response.indexOf('(');
                int end = response.indexOf(')');
                String[] parts = response.substring(start + 1, end).split(",");
                
                String dataIP = parts[0] + "." + parts[1] + "." + parts[2] + "." + parts[3];
                int dataPort = Integer.parseInt(parts[4]) * 256 + Integer.parseInt(parts[5]);
                
                System.out.println("Data connection: " + dataIP + ":" + dataPort);
                return new Socket(dataIP, dataPort);
            }
        } catch (IOException e) {
            System.err.println("Passive mode failed: " + e.getMessage());
        }
        return null;
    }
    
    private void sendCommand(String command) {
        controlWriter.println(command);
        System.out.println("Sent: " + command);
    }
    
    private String readResponse() throws IOException {
        return controlReader.readLine();
    }
    
    public void disconnect() {
        try {
            if (connected) {
                sendCommand("QUIT");
                readResponse();
                
                controlReader.close();
                controlWriter.close();
                controlSocket.close();
                
                connected = false;
                System.out.println("Disconnected from FTP server");
            }
        } catch (IOException e) {
            System.err.println("Disconnect error: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        System.out.println("Simple FTP Client Demo\\n");
        
        SimpleFTPClient ftp = new SimpleFTPClient("ftp.example.com", 21);
        
        try {
            if (ftp.connect()) {
                if (ftp.login("username", "password")) {
                    // List files
                    ftp.listFiles();
                    
                    // Upload file
                    ftp.uploadFile("local-file.txt", "remote-file.txt");
                    
                    // Download file
                    ftp.downloadFile("remote-file.txt", "downloaded-file.txt");
                }
            }
        } finally {
            ftp.disconnect();
        }
    }
}`
    }
  ],

  resources: [
    { type: 'video', title: 'Email Protocols Explained', url: 'https://www.youtube.com/results?search_query=smtp+pop3+imap+explained', description: 'Video explanations of email protocols' },
    { type: 'article', title: 'FTP Protocol Guide', url: 'https://www.rfc-editor.org/rfc/rfc959.html', description: 'Official FTP protocol specification' },
    { type: 'article', title: 'SMTP Protocol Guide', url: 'https://www.rfc-editor.org/rfc/rfc5321.html', description: 'Official SMTP protocol specification' },
    { type: 'article', title: 'IMAP vs POP3 Comparison', url: 'https://www.cloudflare.com/learning/email-security/imap-vs-pop3/', description: 'Detailed comparison of email protocols' },
    { type: 'tool', title: 'Email Testing Tools', url: 'https://www.mail-tester.com/', description: 'Tools for testing email configuration' }
  ],

  questions: [
    {
      question: "What's the difference between POP3 and IMAP email protocols?",
      answer: "POP3 downloads emails to client and typically deletes from server, designed for single-device access with offline reading. IMAP keeps emails on server with synchronization across multiple devices, supports server-side folders, search, and partial downloads. Use POP3 for single device with limited server storage, IMAP for multiple devices and collaborative access. IMAP requires more server storage but provides better synchronization and features."
    },
    
    {
      question: "How does FTP handle data connections in active vs passive mode?",
      answer: "Active mode: Client connects to server port 21 for control, sends PORT command with client IP:port, server connects back to client for data transfer. Problems with firewalls blocking incoming connections. Passive mode: Client connects to server port 21, sends PASV command, server responds with IP:port, client connects to server's data port. Passive mode is firewall-friendly and recommended for modern networks."
    },
    
    {
      question: "Explain the SMTP email sending process step by step.",
      answer: "SMTP process: 1) Client connects to SMTP server (port 25/587), 2) Server responds with 220 ready, 3) Client sends EHLO/HELO, 4) Server lists capabilities, 5) STARTTLS for encryption, 6) AUTH for authentication, 7) MAIL FROM specifies sender, 8) RCPT TO specifies recipient(s), 9) DATA command starts message, 10) Client sends headers and body, 11) End with single dot, 12) Server accepts with 250 OK, 13) QUIT to disconnect."
    },
    
    {
      question: "What are the security considerations for email protocols?",
      answer: "Security measures: 1) Use encrypted versions (SMTPS, POP3S, IMAPS, FTPS), 2) Strong authentication (OAuth2 vs plain passwords), 3) Certificate validation for TLS connections, 4) Avoid plain text protocols on untrusted networks, 5) Use app-specific passwords instead of account passwords, 6) Implement rate limiting and abuse detection, 7) Regular security updates, 8) Monitor for suspicious activities and unauthorized access attempts."
    },
    
    {
      question: "How do you choose between different file transfer protocols?",
      answer: "Protocol selection: FTP - legacy systems, simple file transfer, not secure by default. FTPS - FTP with SSL/TLS encryption, good for secure file transfer. SFTP - SSH-based, most secure, single port (22), preferred for modern systems. HTTP/HTTPS - web-based transfers, firewall-friendly, good for public file sharing. Consider security requirements, firewall restrictions, client support, and performance needs when choosing."
    },
    
    {
      question: "What authentication methods are available for SMTP?",
      answer: "SMTP authentication methods: 1) LOGIN - base64 encoded username/password, simple but less secure, 2) PLAIN - username/password in single base64 string, 3) CRAM-MD5 - challenge-response, password never sent plaintext, 4) OAUTH2 - token-based, no password storage, modern secure method, 5) XOAUTH2 - Google's OAuth implementation. OAuth2 is recommended for modern applications as it eliminates password storage and provides better security."
    },
    
    {
      question: "How does IMAP synchronization work across multiple devices?",
      answer: "IMAP synchronization: 1) Server maintains master copy of all emails and folders, 2) Each client connects and syncs folder structure, 3) Changes (read/unread, flags, moves) are immediately synced to server, 4) Other clients receive updates on next sync, 5) Partial downloads optimize bandwidth, 6) UIDs ensure message consistency across clients, 7) IDLE command provides real-time notifications. This enables seamless email access from multiple devices with consistent state."
    },
    
    {
      question: "What are the common FTP response codes and their meanings?",
      answer: "FTP response codes: 1xx - Positive preliminary (150 Opening data connection), 2xx - Positive completion (200 OK, 226 Transfer complete, 230 Login successful), 3xx - Positive intermediate (331 Password required), 4xx - Transient negative (425 Can't open data connection, 450 File unavailable), 5xx - Permanent negative (500 Command not recognized, 530 Not logged in, 550 File unavailable). First digit indicates category, helps with error handling and automation."
    },
    
    {
      question: "How do you handle email attachments in SMTP?",
      answer: "Email attachments use MIME (Multipurpose Internet Mail Extensions): 1) Create multipart message with Content-Type: multipart/mixed, 2) Text part has Content-Type: text/plain, 3) Attachment parts have appropriate Content-Type and Content-Disposition: attachment, 4) Binary data encoded in base64, 5) Boundary separates parts, 6) Each part has headers describing content. Libraries like Python's email.mime handle encoding automatically."
    },
    
    {
      question: "What are the bandwidth and storage implications of POP3 vs IMAP?",
      answer: "Bandwidth: POP3 downloads entire messages initially (high bandwidth), then offline access. IMAP downloads headers first, full messages on demand (optimized bandwidth), supports partial downloads. Storage: POP3 stores emails locally (high client storage, low server storage), IMAP stores on server (low client storage, high server storage). IMAP better for limited bandwidth/storage devices, POP3 better for limited server storage scenarios."
    }
  ]
};