export const applicationLayer = {
  id: 'application-layer',
  title: 'Application Layer',
  subtitle: 'HTTP, DNS, FTP, SMTP - User Interface to Network Services',
  
  summary: 'The Application Layer is the topmost layer in network models, providing network services directly to end-users. It includes protocols like HTTP for web browsing, DNS for domain resolution, SMTP for email, and FTP for file transfer.',
  
  analogy: 'Think of the Application Layer as a Restaurant Menu: Just like a menu provides different food options (HTTP for web, SMTP for email, FTP for files) without showing how the kitchen works, the Application Layer provides various network services without exposing the complex networking details underneath.',
  
  explanation: `The Application Layer (Layer 7 in OSI, Layer 4 in TCP/IP) is where network applications and their protocols operate. It provides network services directly to end-users and applications.

KEY CHARACTERISTICS:
• Closest to the end user
• Provides network services to applications
• Handles user authentication and privacy
• Manages data formatting and encryption
• Controls dialog between applications

MAJOR PROTOCOLS:

1. HTTP/HTTPS (Web Browsing)
   - Hypertext Transfer Protocol
   - Request-response model
   - Stateless protocol
   - Methods: GET, POST, PUT, DELETE

2. DNS (Domain Name System)
   - Translates domain names to IP addresses
   - Hierarchical distributed database
   - Uses UDP port 53
   - Caching for performance

3. SMTP (Email Sending)
   - Simple Mail Transfer Protocol
   - Push protocol for sending emails
   - Uses TCP port 25/587
   - Works with POP3/IMAP for receiving

4. FTP (File Transfer)
   - File Transfer Protocol
   - Separate control and data connections
   - Active vs Passive modes
   - Uses TCP ports 20 and 21

5. DHCP (Dynamic IP Assignment)
   - Dynamic Host Configuration Protocol
   - Automatically assigns IP addresses
   - Lease-based system
   - Uses UDP ports 67/68`,

  keyPoints: [
    'Provides network services directly to end-users and applications',
    'HTTP/HTTPS handles web communication with request-response model',
    'DNS translates human-readable domain names to IP addresses',
    'SMTP sends emails while POP3/IMAP receive emails',
    'FTP transfers files using separate control and data connections',
    'DHCP automatically assigns IP addresses to network devices',
    'Handles data formatting, encryption, and user authentication',
    'Each protocol uses specific ports and communication patterns'
  ],

  codeExamples: [
    {
      title: 'HTTP Client - Web Request Implementation',
      description: 'Java implementation of HTTP client making GET and POST requests with proper connection handling.',
      language: 'java',
      code: `import java.io.*;
import java.net.*;
import java.util.*;

public class HTTPClient {
    
    // HTTP GET Request - Retrieve data from server
    public static String sendGETRequest(String urlString) {
        StringBuilder response = new StringBuilder();
        
        try {
            // Create URL object
            URL url = new URL(urlString);
            
            // Open HTTP connection
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // Set request method and headers
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "Java HTTP Client");
            connection.setRequestProperty("Accept", "application/json");
            connection.setConnectTimeout(5000); // 5 second timeout
            connection.setReadTimeout(5000);
            
            // Get response code
            int responseCode = connection.getResponseCode();
            System.out.println("GET Response Code: " + responseCode);
            
            // Read response
            BufferedReader reader;
            if (responseCode >= 200 && responseCode < 300) {
                reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            } else {
                reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
            }
            
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line).append("\\n");
            }
            reader.close();
            
            // Close connection
            connection.disconnect();
            
        } catch (IOException e) {
            System.err.println("HTTP GET Error: " + e.getMessage());
            return "Error: " + e.getMessage();
        }
        
        return response.toString();
    }
    
    // HTTP POST Request - Send data to server
    public static String sendPOSTRequest(String urlString, String jsonData) {
        StringBuilder response = new StringBuilder();
        
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // Configure POST request
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");
            connection.setDoOutput(true); // Enable output for POST data
            
            // Send POST data
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonData.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            
            // Get response
            int responseCode = connection.getResponseCode();
            System.out.println("POST Response Code: " + responseCode);
            
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(connection.getInputStream(), "utf-8"));
            
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line.trim());
            }
            reader.close();
            connection.disconnect();
            
        } catch (IOException e) {
            System.err.println("HTTP POST Error: " + e.getMessage());
            return "Error: " + e.getMessage();
        }
        
        return response.toString();
    }
    
    // Parse HTTP Response Headers
    public static void displayResponseHeaders(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("HEAD"); // Only get headers
            
            System.out.println("\\n=== HTTP Response Headers ===");
            System.out.println("Response Code: " + connection.getResponseCode());
            System.out.println("Response Message: " + connection.getResponseMessage());
            
            // Display all headers
            Map<String, List<String>> headers = connection.getHeaderFields();
            for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
                String key = entry.getKey();
                List<String> values = entry.getValue();
                if (key != null) {
                    System.out.println(key + ": " + String.join(", ", values));
                }
            }
            
            connection.disconnect();
            
        } catch (IOException e) {
            System.err.println("Error getting headers: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        System.out.println("HTTP Client Demo\\n");
        
        // Example 1: GET Request
        System.out.println("1. Making GET Request...");
        String getResponse = sendGETRequest("https://jsonplaceholder.typicode.com/posts/1");
        System.out.println("GET Response:\\n" + getResponse);
        
        // Example 2: POST Request
        System.out.println("\\n2. Making POST Request...");
        String postData = "{\\"title\\": \\"Java HTTP Post\\", \\"body\\": \\"Test post\\", \\"userId\\": 1}";
        String postResponse = sendPOSTRequest("https://jsonplaceholder.typicode.com/posts", postData);
        System.out.println("POST Response:\\n" + postResponse);
        
        // Example 3: Display Headers
        System.out.println("\\n3. Getting Response Headers...");
        displayResponseHeaders("https://www.google.com");
    }
}`
    },
    {
      title: 'DNS Resolver - Domain Name Resolution',
      description: 'Java implementation of DNS resolution showing how domain names are converted to IP addresses.',
      language: 'java',
      code: `import java.net.*;
import java.util.*;

public class DNSResolver {
    
    // Resolve domain name to IP address
    public static void resolveDomain(String domainName) {
        try {
            System.out.println("\\n=== Resolving: " + domainName + " ===");
            
            // Get all IP addresses for the domain
            InetAddress[] addresses = InetAddress.getAllByName(domainName);
            
            System.out.println("Found " + addresses.length + " IP address(es):");
            
            for (int i = 0; i < addresses.length; i++) {
                InetAddress addr = addresses[i];
                System.out.println((i + 1) + ". IP Address: " + addr.getHostAddress());
                System.out.println("   Canonical Name: " + addr.getCanonicalHostName());
                System.out.println("   Is IPv4: " + (addr instanceof Inet4Address));
                System.out.println("   Is IPv6: " + (addr instanceof Inet6Address));
                System.out.println("   Is Reachable: " + addr.isReachable(3000));
                System.out.println();
            }
            
        } catch (UnknownHostException e) {
            System.err.println("Domain not found: " + domainName);
        } catch (Exception e) {
            System.err.println("DNS Resolution error: " + e.getMessage());
        }
    }
    
    // Reverse DNS lookup - IP to domain name
    public static void reverseDNSLookup(String ipAddress) {
        try {
            System.out.println("\\n=== Reverse DNS for: " + ipAddress + " ===");
            
            InetAddress addr = InetAddress.getByName(ipAddress);
            String hostName = addr.getCanonicalHostName();
            
            System.out.println("IP Address: " + addr.getHostAddress());
            System.out.println("Host Name: " + hostName);
            
            // Check if reverse lookup was successful
            if (hostName.equals(ipAddress)) {
                System.out.println("No reverse DNS record found");
            } else {
                System.out.println("Reverse DNS successful");
            }
            
        } catch (UnknownHostException e) {
            System.err.println("Invalid IP address: " + ipAddress);
        } catch (Exception e) {
            System.err.println("Reverse DNS error: " + e.getMessage());
        }
    }
    
    // Get local machine network information
    public static void getLocalNetworkInfo() {
        try {
            System.out.println("\\n=== Local Network Information ===");
            
            // Get local host information
            InetAddress localHost = InetAddress.getLocalHost();
            System.out.println("Local Host Name: " + localHost.getHostName());
            System.out.println("Local IP Address: " + localHost.getHostAddress());
            
            // Get all network interfaces
            System.out.println("\\nNetwork Interfaces:");
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            
            while (interfaces.hasMoreElements()) {
                NetworkInterface networkInterface = interfaces.nextElement();
                
                if (networkInterface.isUp() && !networkInterface.isLoopback()) {
                    System.out.println("\\nInterface: " + networkInterface.getDisplayName());
                    System.out.println("Name: " + networkInterface.getName());
                    
                    // Get all IP addresses for this interface
                    Enumeration<InetAddress> addresses = networkInterface.getInetAddresses();
                    while (addresses.hasMoreElements()) {
                        InetAddress addr = addresses.nextElement();
                        System.out.println("  IP: " + addr.getHostAddress());
                        System.out.println("  Type: " + (addr instanceof Inet4Address ? "IPv4" : "IPv6"));
                    }
                }
            }
            
        } catch (Exception e) {
            System.err.println("Network info error: " + e.getMessage());
        }
    }
    
    // DNS Cache demonstration
    public static void demonstrateDNSCaching() {
        System.out.println("\\n=== DNS Caching Demo ===");
        
        String domain = "www.google.com";
        
        // First resolution (will query DNS server)
        long startTime = System.currentTimeMillis();
        resolveDomain(domain);
        long firstTime = System.currentTimeMillis() - startTime;
        
        // Second resolution (should use cache)
        startTime = System.currentTimeMillis();
        resolveDomain(domain);
        long secondTime = System.currentTimeMillis() - startTime;
        
        System.out.println("First resolution time: " + firstTime + "ms");
        System.out.println("Second resolution time: " + secondTime + "ms");
        System.out.println("Cache speedup: " + (firstTime > secondTime ? "Yes" : "No"));
    }
    
    public static void main(String[] args) {
        System.out.println("DNS Resolver Demo");
        
        // Test various domains
        String[] domains = {
            "www.google.com",
            "www.github.com", 
            "www.stackoverflow.com",
            "localhost"
        };
        
        // Resolve each domain
        for (String domain : domains) {
            resolveDomain(domain);
        }
        
        // Reverse DNS examples
        reverseDNSLookup("8.8.8.8");        // Google DNS
        reverseDNSLookup("1.1.1.1");        // Cloudflare DNS
        
        // Local network information
        getLocalNetworkInfo();
        
        // DNS caching demonstration
        demonstrateDNSCaching();
    }
}`
    },
    {
      title: 'SMTP Email Client - Send Emails',
      description: 'Java implementation of SMTP client for sending emails with authentication and attachments.',
      language: 'java',
      code: `import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.*;

public class SMTPEmailClient {
    
    private String smtpHost;
    private int smtpPort;
    private String username;
    private String password;
    private boolean useSSL;
    
    public SMTPEmailClient(String host, int port, String user, String pass, boolean ssl) {
        this.smtpHost = host;
        this.smtpPort = port;
        this.username = user;
        this.password = pass;
        this.useSSL = ssl;
    }
    
    // Send simple text email
    public boolean sendTextEmail(String to, String subject, String messageText) {
        try {
            // Create email session
            Session session = createEmailSession();
            
            // Create message
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setText(messageText);
            message.setSentDate(new Date());
            
            // Send email
            Transport.send(message);
            System.out.println("Text email sent successfully to: " + to);
            return true;
            
        } catch (MessagingException e) {
            System.err.println("Failed to send text email: " + e.getMessage());
            return false;
        }
    }
    
    // Send HTML email
    public boolean sendHTMLEmail(String to, String subject, String htmlContent) {
        try {
            Session session = createEmailSession();
            
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            
            // Set HTML content
            message.setContent(htmlContent, "text/html; charset=utf-8");
            message.setSentDate(new Date());
            
            Transport.send(message);
            System.out.println("HTML email sent successfully to: " + to);
            return true;
            
        } catch (MessagingException e) {
            System.err.println("Failed to send HTML email: " + e.getMessage());
            return false;
        }
    }
    
    // Send email with attachment
    public boolean sendEmailWithAttachment(String to, String subject, String messageText, String filePath) {
        try {
            Session session = createEmailSession();
            
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            
            // Create multipart message
            Multipart multipart = new MimeMultipart();
            
            // Text part
            BodyPart textPart = new MimeBodyPart();
            textPart.setText(messageText);
            multipart.addBodyPart(textPart);
            
            // Attachment part
            BodyPart attachmentPart = new MimeBodyPart();
            DataSource source = new FileDataSource(filePath);
            attachmentPart.setDataHandler(new DataHandler(source));
            attachmentPart.setFileName(new java.io.File(filePath).getName());
            multipart.addBodyPart(attachmentPart);
            
            // Set multipart content
            message.setContent(multipart);
            message.setSentDate(new Date());
            
            Transport.send(message);
            System.out.println("Email with attachment sent to: " + to);
            return true;
            
        } catch (MessagingException e) {
            System.err.println("Failed to send email with attachment: " + e.getMessage());
            return false;
        }
    }
    
    // Create email session with authentication
    private Session createEmailSession() {
        Properties props = new Properties();
        
        // SMTP server configuration
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", String.valueOf(smtpPort));
        props.put("mail.smtp.auth", "true");
        
        if (useSSL) {
            props.put("mail.smtp.ssl.enable", "true");
            props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        } else {
            props.put("mail.smtp.starttls.enable", "true");
        }
        
        // Create authenticator
        Authenticator authenticator = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        };
        
        return Session.getInstance(props, authenticator);
    }
    
    // Send bulk emails (mailing list)
    public void sendBulkEmails(List<String> recipients, String subject, String messageText) {
        System.out.println("\\nSending bulk emails to " + recipients.size() + " recipients...");
        
        int successCount = 0;
        int failCount = 0;
        
        for (String recipient : recipients) {
            if (sendTextEmail(recipient, subject, messageText)) {
                successCount++;
            } else {
                failCount++;
            }
            
            // Add delay to avoid being flagged as spam
            try {
                Thread.sleep(1000); // 1 second delay
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        System.out.println("\\nBulk email results:");
        System.out.println("Successful: " + successCount);
        System.out.println("Failed: " + failCount);
    }
    
    public static void main(String[] args) {
        System.out.println("SMTP Email Client Demo\\n");
        
        // Configure SMTP settings (example with Gmail)
        SMTPEmailClient emailClient = new SMTPEmailClient(
            "smtp.gmail.com",     // SMTP host
            587,                  // SMTP port
            "your-email@gmail.com", // Your email
            "your-app-password",    // App password (not regular password)
            false                 // Use STARTTLS (not SSL)
        );
        
        // Example 1: Send simple text email
        System.out.println("1. Sending text email...");
        emailClient.sendTextEmail(
            "recipient@example.com",
            "Test Email from Java",
            "Hello! This is a test email sent from Java SMTP client."
        );
        
        // Example 2: Send HTML email
        System.out.println("\\n2. Sending HTML email...");
        String htmlContent = "<html><body>" +
            "<h2 style='color: blue;'>HTML Email Test</h2>" +
            "<p>This is an <b>HTML email</b> with formatting.</p>" +
            "<ul><li>Feature 1</li><li>Feature 2</li></ul>" +
            "</body></html>";
        
        emailClient.sendHTMLEmail(
            "recipient@example.com",
            "HTML Email Test",
            htmlContent
        );
        
        // Example 3: Send email with attachment
        System.out.println("\\n3. Sending email with attachment...");
        emailClient.sendEmailWithAttachment(
            "recipient@example.com",
            "Email with Attachment",
            "Please find the attached file.",
            "path/to/your/file.pdf"  // Replace with actual file path
        );
        
        // Example 4: Send bulk emails
        System.out.println("\\n4. Sending bulk emails...");
        List<String> recipients = Arrays.asList(
            "user1@example.com",
            "user2@example.com",
            "user3@example.com"
        );
        
        emailClient.sendBulkEmails(
            recipients,
            "Newsletter - Java Programming Tips",
            "Welcome to our Java programming newsletter!"
        );
        
        System.out.println("\\nSMTP Email Demo completed!");
    }
}`
    },
    {
      title: 'FTP Client - File Transfer Implementation',
      description: 'Java FTP client implementation for uploading, downloading, and managing files on FTP servers.',
      language: 'java',
      code: `import java.io.*;
import java.net.*;
import java.util.*;

public class FTPClient {
    
    private Socket controlSocket;
    private BufferedReader controlReader;
    private PrintWriter controlWriter;
    private String ftpServer;
    private int ftpPort;
    private boolean isConnected = false;
    
    public FTPClient(String server, int port) {
        this.ftpServer = server;
        this.ftpPort = port;
    }
    
    // Connect to FTP server
    public boolean connect() {
        try {
            System.out.println("Connecting to FTP server: " + ftpServer + ":" + ftpPort);
            
            // Establish control connection
            controlSocket = new Socket(ftpServer, ftpPort);
            controlReader = new BufferedReader(new InputStreamReader(controlSocket.getInputStream()));
            controlWriter = new PrintWriter(controlSocket.getOutputStream(), true);
            
            // Read welcome message
            String response = readResponse();
            System.out.println("Server response: " + response);
            
            if (response.startsWith("220")) {
                isConnected = true;
                System.out.println("Connected successfully!");
                return true;
            }
            
        } catch (IOException e) {
            System.err.println("Connection failed: " + e.getMessage());
        }
        
        return false;
    }
    
    // Login to FTP server
    public boolean login(String username, String password) {
        if (!isConnected) {
            System.err.println("Not connected to server!");
            return false;
        }
        
        try {
            // Send username
            sendCommand("USER " + username);
            String response = readResponse();
            System.out.println("USER response: " + response);
            
            if (response.startsWith("331")) {
                // Send password
                sendCommand("PASS " + password);
                response = readResponse();
                System.out.println("PASS response: " + response);
                
                if (response.startsWith("230")) {
                    System.out.println("Login successful!");
                    return true;
                }
            }
            
        } catch (IOException e) {
            System.err.println("Login failed: " + e.getMessage());
        }
        
        return false;
    }
    
    // List files in current directory
    public void listFiles() {
        try {
            // Enter passive mode
            Socket dataSocket = enterPassiveMode();
            if (dataSocket == null) return;
            
            // Send LIST command
            sendCommand("LIST");
            String response = readResponse();
            
            if (response.startsWith("150") || response.startsWith("125")) {
                // Read file list from data connection
                BufferedReader dataReader = new BufferedReader(
                    new InputStreamReader(dataSocket.getInputStream()));
                
                System.out.println("\\n=== File List ===");
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
            System.err.println("List files failed: " + e.getMessage());
        }
    }
    
    // Upload file to FTP server
    public boolean uploadFile(String localFilePath, String remoteFileName) {
        try {
            File localFile = new File(localFilePath);
            if (!localFile.exists()) {
                System.err.println("Local file not found: " + localFilePath);
                return false;
            }
            
            // Enter passive mode
            Socket dataSocket = enterPassiveMode();
            if (dataSocket == null) return false;
            
            // Send STOR command
            sendCommand("STOR " + remoteFileName);
            String response = readResponse();
            
            if (response.startsWith("150") || response.startsWith("125")) {
                // Upload file data
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
    
    // Download file from FTP server
    public boolean downloadFile(String remoteFileName, String localFilePath) {
        try {
            // Enter passive mode
            Socket dataSocket = enterPassiveMode();
            if (dataSocket == null) return false;
            
            // Send RETR command
            sendCommand("RETR " + remoteFileName);
            String response = readResponse();
            
            if (response.startsWith("150") || response.startsWith("125")) {
                // Download file data
                InputStream dataInput = dataSocket.getInputStream();
                FileOutputStream fileOutput = new FileOutputStream(localFilePath);
                
                byte[] buffer = new byte[4096];
                int bytesRead;
                long totalBytes = 0;
                
                System.out.println("Downloading " + remoteFileName + "...");
                
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
    
    // Enter passive mode and return data socket
    private Socket enterPassiveMode() {
        try {
            sendCommand("PASV");
            String response = readResponse();
            
            if (response.startsWith("227")) {
                // Parse passive mode response to get IP and port
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
    
    // Send command to FTP server
    private void sendCommand(String command) {
        controlWriter.println(command);
        System.out.println("Sent: " + command);
    }
    
    // Read response from FTP server
    private String readResponse() throws IOException {
        return controlReader.readLine();
    }
    
    // Disconnect from FTP server
    public void disconnect() {
        try {
            if (isConnected) {
                sendCommand("QUIT");
                readResponse();
                
                controlReader.close();
                controlWriter.close();
                controlSocket.close();
                
                isConnected = false;
                System.out.println("Disconnected from FTP server");
            }
        } catch (IOException e) {
            System.err.println("Disconnect error: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        System.out.println("FTP Client Demo\\n");
        
        // Create FTP client
        FTPClient ftpClient = new FTPClient("ftp.example.com", 21);
        
        try {
            // Connect to server
            if (ftpClient.connect()) {
                
                // Login
                if (ftpClient.login("username", "password")) {
                    
                    // List files
                    ftpClient.listFiles();
                    
                    // Upload a file
                    ftpClient.uploadFile("local-file.txt", "remote-file.txt");
                    
                    // Download a file
                    ftpClient.downloadFile("remote-file.txt", "downloaded-file.txt");
                    
                    // List files again to see changes
                    ftpClient.listFiles();
                }
            }
            
        } finally {
            // Always disconnect
            ftpClient.disconnect();
        }
        
        System.out.println("\\nFTP Demo completed!");
    }
}`
    }
  ],

  resources: [
    {
      title: 'HTTP Protocol Specification (RFC 7231)',
      url: 'https://tools.ietf.org/html/rfc7231',
      description: 'Official HTTP/1.1 protocol specification'
    },
    {
      title: 'DNS Protocol Specification (RFC 1035)',
      url: 'https://tools.ietf.org/html/rfc1035',
      description: 'Domain Name System protocol specification'
    },
    {
      title: 'SMTP Protocol Specification (RFC 5321)',
      url: 'https://tools.ietf.org/html/rfc5321',
      description: 'Simple Mail Transfer Protocol specification'
    },
    {
      title: 'FTP Protocol Specification (RFC 959)',
      url: 'https://tools.ietf.org/html/rfc959',
      description: 'File Transfer Protocol specification'
    },
    {
      title: 'Java Network Programming Tutorial',
      url: 'https://docs.oracle.com/javase/tutorial/networking/',
      description: 'Official Oracle Java networking tutorial'
    },
    {
      title: 'HTTP Status Codes Reference',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
      description: 'Complete list of HTTP status codes and meanings'
    }
  ],

  questions: [
    {
      question: "What is the difference between HTTP and HTTPS?",
      answer: "HTTP (Hypertext Transfer Protocol) is unencrypted and uses port 80, while HTTPS (HTTP Secure) adds SSL/TLS encryption and uses port 443. HTTPS provides: 1) Data Encryption - protects data in transit, 2) Authentication - verifies server identity, 3) Data Integrity - prevents tampering. Example: HTTP sends passwords in plain text, HTTPS encrypts them. Modern browsers mark HTTP sites as 'Not Secure'."
    },
    {
      question: "How does DNS resolution work step by step?",
      answer: "DNS resolution process: 1) Browser checks local cache, 2) If not found, queries local DNS resolver, 3) Resolver checks its cache, 4) If not cached, queries root DNS servers, 5) Root servers return TLD (Top Level Domain) servers, 6) TLD servers return authoritative name servers, 7) Authoritative servers return IP address, 8) Response cached at each level for future use. Example: www.google.com → Root servers → .com TLD → Google's name servers → IP address."
    },
    {
      question: "What are the main HTTP methods and their purposes?",
      answer: "HTTP Methods: 1) GET - Retrieve data (idempotent, cacheable), 2) POST - Submit data (not idempotent), 3) PUT - Update/create resource (idempotent), 4) DELETE - Remove resource (idempotent), 5) HEAD - Get headers only, 6) PATCH - Partial update, 7) OPTIONS - Get allowed methods. Example: GET /users (list users), POST /users (create user), PUT /users/123 (update user 123), DELETE /users/123 (delete user 123)."
    },
    {
      question: "How does SMTP work for sending emails?",
      answer: "SMTP (Simple Mail Transfer Protocol) process: 1) Client connects to SMTP server (port 25/587), 2) Server responds with 220 (ready), 3) Client sends HELO/EHLO command, 4) Authentication if required, 5) MAIL FROM command (sender), 6) RCPT TO command (recipient), 7) DATA command followed by email content, 8) QUIT to close connection. SMTP only sends emails; POP3/IMAP retrieve them. Example: Gmail SMTP uses smtp.gmail.com:587 with STARTTLS encryption."
    },
    {
      question: "What is the difference between FTP active and passive modes?",
      answer: "FTP Data Connection Modes: Active Mode - Server initiates data connection to client (server connects to client's port), can fail with firewalls/NAT. Passive Mode - Client initiates data connection to server (client connects to server's port), firewall-friendly. Process: 1) Control connection established (port 21), 2) PASV command requests passive mode, 3) Server responds with IP:port for data connection, 4) Client connects to that port for data transfer. Modern FTP clients default to passive mode."
    },
    {
      question: "How do HTTP status codes work and what do they mean?",
      answer: "HTTP Status Code Categories: 1xx (Informational) - request received, 2xx (Success) - request successful, 3xx (Redirection) - further action needed, 4xx (Client Error) - client mistake, 5xx (Server Error) - server problem. Common codes: 200 OK, 201 Created, 301 Moved Permanently, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error, 503 Service Unavailable. Example: 404 means resource not found, 500 means server crashed."
    },
    {
      question: "What is DHCP and how does it assign IP addresses?",
      answer: "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses. Process: 1) DHCP Discover - client broadcasts request, 2) DHCP Offer - server offers IP address, 3) DHCP Request - client requests offered IP, 4) DHCP Acknowledge - server confirms assignment. DHCP provides: IP address, subnet mask, default gateway, DNS servers, lease time. Benefits: automatic configuration, prevents IP conflicts, centralized management. Example: Home router acts as DHCP server, assigns 192.168.1.100-200 to devices."
    },
    {
      question: "How does HTTP caching work?",
      answer: "HTTP Caching mechanisms: 1) Browser Cache - stores responses locally, 2) Proxy Cache - shared cache for multiple users, 3) CDN Cache - geographically distributed. Cache Headers: Cache-Control (max-age, no-cache), Expires (absolute expiry), ETag (resource version), Last-Modified (modification time). Process: 1) First request fetches resource, 2) Subsequent requests check cache, 3) If valid, serve from cache, 4) If expired, revalidate with server. Example: Cache-Control: max-age=3600 caches for 1 hour."
    },
    {
      question: "What is the difference between TCP and UDP in the context of application protocols?",
      answer: "TCP vs UDP for Application Protocols: TCP (Reliable) - HTTP, SMTP, FTP use TCP for guaranteed delivery, error correction, ordered packets. UDP (Fast) - DNS, DHCP use UDP for speed, low overhead, simple request-response. TCP provides: connection establishment, flow control, congestion control, error recovery. UDP provides: connectionless, minimal overhead, broadcast support. Example: DNS uses UDP for quick lookups but falls back to TCP for large responses. Email (SMTP) needs TCP to ensure message delivery."
    },
    {
      question: "How do web browsers handle multiple HTTP requests?",
      answer: "Browser HTTP Request Handling: 1) Connection Pooling - reuse TCP connections, 2) Parallel Requests - multiple simultaneous requests (6-8 per domain), 3) HTTP/2 Multiplexing - multiple requests over single connection, 4) Keep-Alive - maintain connections for reuse, 5) Pipelining - send requests without waiting for responses. Optimization: domain sharding (multiple subdomains), resource bundling, HTTP/2 server push. Example: Loading webpage with 20 images uses connection pool to download 6-8 images simultaneously."
    }
  ]
};

export default applicationLayer;