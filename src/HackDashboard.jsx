import { useState, useEffect, useRef } from "react";

const tools = {
  recon: {
    label: "RECONNAISSANCE",
    icon: "◎",
    color: "#00f5ff",
    glow: "0 0 20px #00f5ff44",
    tools: [
      { name: "Nmap", desc: "Scanner réseau & détection de services/OS", cmd: "nmap -sV -O -A <target>", stars: "9.8k", lang: "C", badge: "STABLE" },
      { name: "Masscan", desc: "Scanner de ports ultra-rapide (100M pkt/s)", cmd: "masscan -p1-65535 <ip> --rate=10000", stars: "22k", lang: "C", badge: "FAST" },
      { name: "theHarvester", desc: "OSINT — emails, sous-domaines, IPs", cmd: "theHarvester -d target.com -b all", stars: "10k", lang: "Python", badge: "OSINT" },
      { name: "Recon-ng", desc: "Framework de reconnaissance modulaire", cmd: "recon-ng -w <workspace>", stars: "3.4k", lang: "Python", badge: "MODULAR" },
      { name: "Shodan CLI", desc: "Interface CLI pour le moteur de recherche IoT", cmd: "shodan search apache", stars: "2.1k", lang: "Python", badge: "IoT" },
      { name: "Amass", desc: "Cartographie de surface d'attaque DNS", cmd: "amass enum -d target.com", stars: "11k", lang: "Go", badge: "DNS" },
      { name: "Subfinder", desc: "Énumération passive de sous-domaines (haute vitesse)", cmd: "subfinder -d target.com -all", stars: "11k", lang: "Go", badge: "DNS" },
      { name: "dnsenum", desc: "Énumération DNS exhaustive (records, zones, brute)", cmd: "dnsenum target.com", stars: "1.6k", lang: "Perl", badge: "DNS" },
      { name: "Maltego CE", desc: "Plateforme OSINT graphique (transforms communautaires)", cmd: "maltego", stars: "N/A", lang: "Java", badge: "OSINT" },
    ],
  },
  exploit: {
    label: "EXPLOITATION",
    icon: "⚡",
    color: "#ff3366",
    glow: "0 0 20px #ff336644",
    tools: [
      { name: "Metasploit", desc: "Framework d'exploitation le plus complet", cmd: "msfconsole -q", stars: "33k", lang: "Ruby", badge: "FLAGSHIP" },
      { name: "SQLMap", desc: "Injection SQL automatisée & DB takeover", cmd: "sqlmap -u 'http://target.com/id=1' --dbs", stars: "32k", lang: "Python", badge: "AUTO" },
      { name: "BeEF", desc: "Browser Exploitation Framework (XSS hooks)", cmd: "beef-xss", stars: "9.4k", lang: "Ruby", badge: "XSS" },
      { name: "SearchSploit", desc: "Recherche locale dans ExploitDB offline", cmd: "searchsploit apache 2.4", stars: "N/A", lang: "Bash", badge: "DB" },
      { name: "RouterSploit", desc: "Framework d'exploitation d'équipements réseau", cmd: "python3 rsf.py", stars: "11k", lang: "Python", badge: "IoT" },
      { name: "PEASS-ng", desc: "Privilege escalation auditor (linPEAS / winPEAS)", cmd: "curl -L .../linpeas.sh | sh", stars: "16k", lang: "Bash", badge: "AUTO" },
      { name: "linux-exploit-suggester", desc: "Suggère les exploits locaux Linux applicables au kernel", cmd: "./linux-exploit-suggester.sh", stars: "5.6k", lang: "Bash", badge: "AUTO" },
    ],
  },
  web: {
    label: "WEB ATTACK",
    icon: "🌐",
    color: "#bf5fff",
    glow: "0 0 20px #bf5fff44",
    tools: [
      { name: "Nikto", desc: "Scanner de vulnérabilités web (6700+ checks)", cmd: "nikto -h http://target.com", stars: "7.9k", lang: "Perl", badge: "SCAN" },
      { name: "Gobuster", desc: "Brute-force de répertoires/DNS/VHOST", cmd: "gobuster dir -u http://target.com -w /wordlist.txt", stars: "8.9k", lang: "Go", badge: "FUZZ" },
      { name: "ffuf", desc: "Fuzzer web ultra-rapide (Go)", cmd: "ffuf -w wordlist.txt -u http://target/FUZZ", stars: "11k", lang: "Go", badge: "FAST" },
      { name: "WPScan", desc: "Scanner WordPress (plugins, thèmes, users)", cmd: "wpscan --url http://target.com", stars: "8.3k", lang: "Ruby", badge: "CMS" },
      { name: "XSStrike", desc: "Détection et exploitation XSS avancée", cmd: "python3 xsstrike.py -u 'http://target?q='", stars: "13k", lang: "Python", badge: "XSS" },
      { name: "Nuclei", desc: "Scanner de vulnérabilités basé sur templates YAML", cmd: "nuclei -u http://target.com -t cves/", stars: "21k", lang: "Go", badge: "TEMPLATE" },
      { name: "Burp Suite CE", desc: "Proxy d'interception & scanner web (édition Community)", cmd: "burpsuite", stars: "N/A", lang: "Java", badge: "PROXY" },
      { name: "Dirsearch", desc: "Brute-force de chemins web — wordlists modernes", cmd: "dirsearch -u http://target.com -e php,html,js", stars: "12k", lang: "Python", badge: "FUZZ" },
      { name: "Wfuzz", desc: "Fuzzer web (paramètres, headers, payloads, mutations)", cmd: "wfuzz -c -z file,wordlist.txt http://target/FUZZ", stars: "6k", lang: "Python", badge: "FUZZ" },
    ],
  },
  network: {
    label: "NETWORK",
    icon: "⬡",
    color: "#00ff88",
    glow: "0 0 20px #00ff8844",
    tools: [
      { name: "Wireshark", desc: "Analyse de paquets réseau (GUI + CLI)", cmd: "tshark -i eth0 -w capture.pcap", stars: "7.1k", lang: "C", badge: "SNIFF" },
      { name: "Bettercap", desc: "MitM, ARP spoofing, sniffing réseau", cmd: "bettercap -iface eth0", stars: "15k", lang: "Go", badge: "MITM" },
      { name: "Ettercap", desc: "Suite complète pour attaques MitM", cmd: "ettercap -T -q -M arp:remote", stars: "2k", lang: "C", badge: "ARP" },
      { name: "Scapy", desc: "Manipulation de paquets réseau (Python)", cmd: "scapy", stars: "10k", lang: "Python", badge: "CRAFT" },
      { name: "Yersinia", desc: "Attaques protocoles L2 (STP, CDP, DHCP)", cmd: "yersinia -G", stars: "650", lang: "C", badge: "L2" },
      { name: "tcpdump", desc: "Sniffer réseau CLI universel — filtres BPF", cmd: "tcpdump -i eth0 -w capture.pcap 'port 80'", stars: "2.6k", lang: "C", badge: "SNIFF" },
      { name: "Netdiscover", desc: "Découverte d'hôtes ARP actif/passif", cmd: "netdiscover -i eth0 -r 192.168.1.0/24", stars: "N/A", lang: "C", badge: "ARP" },
    ],
  },
  password: {
    label: "PASSWORD",
    icon: "🔓",
    color: "#ffaa00",
    glow: "0 0 20px #ffaa0044",
    tools: [
      { name: "Hashcat", desc: "Cracking GPU — 350+ algo supportés", cmd: "hashcat -m 0 hash.txt wordlist.txt", stars: "20k", lang: "C", badge: "GPU" },
      { name: "John the Ripper", desc: "Casseur de mots de passe multi-format", cmd: "john --wordlist=rockyou.txt hashes.txt", stars: "9.5k", lang: "C", badge: "CLASSIC" },
      { name: "Hydra", desc: "Brute-force de protocoles en ligne", cmd: "hydra -l admin -P pass.txt ssh://target", stars: "10k", lang: "C", badge: "ONLINE" },
      { name: "CeWL", desc: "Génération de wordlist depuis une URL", cmd: "cewl -d 2 -w wordlist.txt http://target.com", stars: "2k", lang: "Ruby", badge: "WORDLIST" },
      { name: "Medusa", desc: "Brute-force parallèle multi-protocoles (alternative à Hydra)", cmd: "medusa -h target -u admin -P passwords.txt -M ssh", stars: "1.3k", lang: "C", badge: "ONLINE" },
      { name: "Hash-Identifier", desc: "Identifie automatiquement le type d'un hash inconnu", cmd: "hash-identifier", stars: "1k", lang: "Python", badge: "CLASSIC" },
    ],
  },
  wireless: {
    label: "WIRELESS",
    icon: "📡",
    color: "#ff6b35",
    glow: "0 0 20px #ff6b3544",
    tools: [
      { name: "Aircrack-ng", desc: "Suite complète audit WiFi (WEP/WPA/WPA2)", cmd: "aircrack-ng -w wordlist.txt capture.cap", stars: "4.2k", lang: "C", badge: "WiFi" },
      { name: "Kismet", desc: "Détecteur réseau WiFi/Bluetooth passif", cmd: "kismet -c wlan0", stars: "6k", lang: "C++", badge: "PASSIVE" },
      { name: "Wifite2", desc: "Automatisation des attaques WiFi", cmd: "wifite --kill --dict wordlist.txt", stars: "5.5k", lang: "Python", badge: "AUTO" },
      { name: "Hostapd-WPE", desc: "Evil AP pour capturer credentials WPA Enterprise", cmd: "hostapd-wpe hostapd-wpe.conf", stars: "800", lang: "C", badge: "EAP" },
      { name: "Reaver", desc: "Brute-force du PIN WPS (WiFi Protected Setup)", cmd: "reaver -i wlan0mon -b <BSSID> -vv", stars: "1.4k", lang: "C", badge: "WiFi" },
      { name: "Pixiewps", desc: "Attaque offline Pixie Dust contre WPS faible", cmd: "pixiewps -e <PKE> -r <PKR> -s <E-Hash1> -z <E-Hash2>", stars: "1.4k", lang: "C", badge: "WiFi" },
    ],
  },
  forensics: {
    label: "FORENSICS",
    icon: "🔬",
    color: "#4ecdc4",
    glow: "0 0 20px #4ecdc444",
    tools: [
      { name: "Volatility3", desc: "Analyse forensique de mémoire RAM", cmd: "python3 vol.py -f mem.dmp windows.pslist", stars: "7.5k", lang: "Python", badge: "MEMORY" },
      { name: "Autopsy", desc: "Plateforme d'investigation numérique complète", cmd: "autopsy", stars: "2.3k", lang: "Java", badge: "GUI" },
      { name: "Binwalk", desc: "Analyse et extraction de firmware", cmd: "binwalk -e firmware.bin", stars: "10k", lang: "Python", badge: "FIRMWARE" },
      { name: "Foremost", desc: "Récupération de fichiers par file carving", cmd: "foremost -i disk.img -o output/", stars: "400", lang: "C", badge: "CARVE" },
      { name: "Sleuthkit", desc: "Boîte à outils CLI investigation disques (fls, mmls, icat)", cmd: "fls -r -m / image.dd > bodyfile.txt", stars: "2.4k", lang: "C", badge: "CARVE" },
      { name: "ExifTool", desc: "Lecture/écriture métadonnées (EXIF, IPTC, XMP, ID3)", cmd: "exiftool image.jpg", stars: "2.4k", lang: "Perl", badge: "META" },
      { name: "Bulk Extractor", desc: "Extraction d'artefacts (emails, URLs, CB, IPs) en masse", cmd: "bulk_extractor -o output/ image.dd", stars: "1.4k", lang: "C++", badge: "CARVE" },
    ],
  },
  c2: {
    label: "C2 / POST-EXPLOIT",
    icon: "👁",
    color: "#e040fb",
    glow: "0 0 20px #e040fb44",
    tools: [
      { name: "Sliver", desc: "C2 Framework moderne multi-protocoles", cmd: "sliver-server", stars: "8k", lang: "Go", badge: "C2" },
      { name: "Empire", desc: "Post-exploitation PowerShell/Python/C#", cmd: "sudo ./ps-empire server", stars: "7.8k", lang: "Python", badge: "C2" },
      { name: "Covenant", desc: "C2 .NET — listeners Grunt", cmd: "dotnet run", stars: "4k", lang: "C#", badge: ".NET" },
      { name: "Havoc", desc: "C2 Framework moderne avec GUI", cmd: "./havoc server --profile profiles/default.yaotl", stars: "6.6k", lang: "C++", badge: "MODERN" },
      { name: "Mythic", desc: "C2 modulaire moderne avec UI web et agents containerisés", cmd: "sudo ./mythic-cli start", stars: "2.6k", lang: "Python", badge: "MODERN" },
      { name: "PoshC2", desc: "C2 PowerShell — payloads C#, PowerShell, Python", cmd: "posh-config server", stars: "1.7k", lang: "Python", badge: "C2" },
    ],
  },
  ad: {
    label: "ACTIVE DIRECTORY",
    icon: "⊞",
    color: "#5d8aff",
    glow: "0 0 20px #5d8aff44",
    tools: [
      { name: "BloodHound", desc: "Cartographie AD & chemins d'attaque (théorie des graphes)", cmd: "bloodhound-python -u user -p pass -d target.local -c all", stars: "11k", lang: "Python", badge: "MAP" },
      { name: "Mimikatz", desc: "Extraction credentials, tickets Kerberos, DCSync", cmd: "mimikatz \"sekurlsa::logonpasswords\" exit", stars: "19k", lang: "C", badge: "KERB" },
      { name: "Impacket", desc: "Suite Python pour protocoles Windows (SMB, MSRPC, Kerberos)", cmd: "impacket-secretsdump domain/user:pass@target", stars: "13k", lang: "Python", badge: "SUITE" },
      { name: "NetExec", desc: "Swiss army knife pentest réseau (ex-CrackMapExec)", cmd: "netexec smb 10.0.0.0/24 -u user -p pass --shares", stars: "3.5k", lang: "Python", badge: "SMB" },
      { name: "Rubeus", desc: "Toolkit Kerberos .NET (Kerberoasting, AS-REP, S4U2self)", cmd: "Rubeus.exe kerberoast /outfile:hashes.txt", stars: "5k", lang: "C#", badge: "KERB" },
      { name: "Kerbrute", desc: "Énumération users & password spraying Kerberos rapide", cmd: "kerbrute userenum --dc DC01 -d target.local users.txt", stars: "3.4k", lang: "Go", badge: "KERB" },
      { name: "Responder", desc: "Poisoner LLMNR/NBT-NS/MDNS — capture hash NTLMv2", cmd: "responder -I eth0 -wv", stars: "5.4k", lang: "Python", badge: "POISON" },
    ],
  },
  cloud: {
    label: "CLOUD",
    icon: "☁",
    color: "#ff9f1c",
    glow: "0 0 20px #ff9f1c44",
    tools: [
      { name: "Pacu", desc: "Framework d'exploitation AWS — 35+ modules d'attaque", cmd: "pacu", stars: "4.5k", lang: "Python", badge: "AWS" },
      { name: "ScoutSuite", desc: "Audit sécurité multi-cloud (AWS/Azure/GCP/Oracle/Alibaba)", cmd: "scout aws --report-dir reports/", stars: "6.7k", lang: "Python", badge: "MULTI" },
      { name: "CloudFox", desc: "Découverte chemins d'attaque AWS/Azure (orienté offensif)", cmd: "cloudfox aws --profile target all-checks", stars: "2.4k", lang: "Go", badge: "AWS" },
      { name: "Prowler", desc: "Audit AWS/Azure/GCP/K8s — 300+ checks CIS/NIST/PCI", cmd: "prowler aws", stars: "11k", lang: "Python", badge: "MULTI" },
      { name: "kube-hunter", desc: "Recherche active de vulnérabilités Kubernetes", cmd: "kube-hunter --remote target.com", stars: "4.7k", lang: "Python", badge: "K8S" },
      { name: "Trivy", desc: "Scanner vulnérabilités containers/IaC/secrets/SBOM", cmd: "trivy image nginx:latest", stars: "22k", lang: "Go", badge: "CONTAINER" },
    ],
  },
  mobile: {
    label: "MOBILE",
    icon: "📱",
    color: "#a3e635",
    glow: "0 0 20px #a3e63544",
    tools: [
      { name: "MobSF", desc: "Mobile Security Framework — analyse statique/dynamique APK/IPA", cmd: "docker run -p 8000:8000 opensecurity/mobile-security-framework-mobsf", stars: "17k", lang: "Python", badge: "MOBILE" },
      { name: "Frida", desc: "Toolkit d'instrumentation dynamique runtime (hook live)", cmd: "frida -U -f com.target.app -l script.js", stars: "16k", lang: "JavaScript", badge: "DYNAMIC" },
      { name: "Objection", desc: "Exploration runtime mobile via Frida (no jailbreak)", cmd: "objection -g com.target.app explore", stars: "8.7k", lang: "Python", badge: "DYNAMIC" },
      { name: "apktool", desc: "Reverse engineering d'APK Android — décompile + repackage", cmd: "apktool d app.apk -o output/", stars: "18k", lang: "Java", badge: "APK" },
      { name: "jadx", desc: "Décompilateur DEX → Java avec GUI moderne", cmd: "jadx -d output/ app.apk", stars: "42k", lang: "Java", badge: "DECOMP" },
      { name: "Drozer", desc: "Framework d'évaluation sécurité Android (IPC, providers)", cmd: "drozer console connect", stars: "1.3k", lang: "Python", badge: "MOBILE" },
    ],
  },
  reverse: {
    label: "REVERSE ENG.",
    icon: "⌬",
    color: "#f72585",
    glow: "0 0 20px #f7258544",
    tools: [
      { name: "Ghidra", desc: "Suite de reverse engineering open source (libérée par la NSA)", cmd: "ghidraRun", stars: "50k", lang: "Java", badge: "RE" },
      { name: "radare2", desc: "Framework de reverse engineering scriptable (CLI)", cmd: "r2 -A binary", stars: "20k", lang: "C", badge: "RE" },
      { name: "Cutter", desc: "GUI moderne pour radare2 / rizin", cmd: "cutter binary", stars: "15k", lang: "C++", badge: "GUI" },
      { name: "gdb-peda", desc: "GDB Python Exploit Dev Assistance", cmd: "gdb -ex 'source ~/peda/peda.py' ./binary", stars: "5.8k", lang: "Python", badge: "DEBUG" },
      { name: "pwntools", desc: "Framework CTF & exploit development en Python", cmd: "python3 -c 'from pwn import *; r = process(\"./bin\")'", stars: "12k", lang: "Python", badge: "DEVKIT" },
      { name: "Pwndbg", desc: "Plugin GDB moderne pour exploit dev (heap viz, gef-like)", cmd: "gdb -ex 'source pwndbg/gdbinit.py' ./binary", stars: "8.1k", lang: "Python", badge: "DEBUG" },
    ],
  },
};

const categoryList = Object.keys(tools);

const langColors = {
  Python: "#3572A5", Go: "#00ADD8", C: "#555555", Ruby: "#701516",
  Perl: "#0298c3", Java: "#b07219", "C++": "#f34b7d", "C#": "#178600",
  Bash: "#89e051", JavaScript: "#f7df1e",
};

const badgeColors = {
  STABLE: "#00ff88", FAST: "#ffaa00", OSINT: "#00f5ff", MODULAR: "#bf5fff",
  DNS: "#4ecdc4", IoT: "#ff6b35", AUTO: "#ff3366", SCAN: "#bf5fff",
  FUZZ: "#00f5ff", CMS: "#ffaa00", XSS: "#ff3366", TEMPLATE: "#00ff88",
  SNIFF: "#4ecdc4", MITM: "#ff3366", ARP: "#ffaa00", CRAFT: "#00ff88",
  L2: "#bf5fff", GPU: "#ffaa00", CLASSIC: "#00f5ff", ONLINE: "#ff3366",
  WORDLIST: "#4ecdc4", WiFi: "#00ff88", PASSIVE: "#4ecdc4", EAP: "#bf5fff",
  MEMORY: "#4ecdc4", GUI: "#00ff88", FIRMWARE: "#ffaa00", CARVE: "#bf5fff",
  C2: "#e040fb", ".NET": "#bf5fff", MODERN: "#ff3366", DB: "#ffaa00",
  FLAGSHIP: "#ff3366",
  PROXY: "#bf5fff", META: "#4ecdc4",
  MAP: "#00f5ff", KERB: "#ffaa00", SUITE: "#bf5fff", SMB: "#ff6b35", POISON: "#ff3366",
  AWS: "#ff9f1c", MULTI: "#00f5ff", K8S: "#00ff88", CONTAINER: "#4ecdc4",
  MOBILE: "#a3e635", DYNAMIC: "#ff3366", APK: "#a3e635", DECOMP: "#bf5fff",
  RE: "#f72585", DEBUG: "#ffaa00", DEVKIT: "#00f5ff",
};

// FIX 1: removed unused 'i' param in the map callback
const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`";
function useGlitch(text, active) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    const interval = setInterval(() => {
      if (frame++ > 8) {
        setDisplay(text);
        clearInterval(interval);
        return;
      }
      // FIX 1: removed unused 'i' parameter
      setDisplay(
        text.split("").map((c) =>
          Math.random() > 0.6
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : c
        ).join("")
      );
    }, 40);
    return () => clearInterval(interval);
  }, [active, text]);
  return display;
}

function ToolCard({ tool, accent, glow }) {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const glitchName = useGlitch(tool.name, hover);

  // FIX 2: clipboard with proper error handling and legacy fallback
  const copy = () => {
    const copyText = (text) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success ? Promise.resolve() : Promise.reject();
    };

    copyText(tool.cmd).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // FIX 3: merged border shorthand to avoid border/borderColor conflict
  const copyBorder = `1px solid ${copied ? accent : "rgba(255,255,255,0.06)"}`;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? "linear-gradient(135deg, rgba(10,10,20,0.95), rgba(20,10,35,0.95))"
          : "rgba(8,8,16,0.8)",
        border: `1px solid ${hover ? accent : "rgba(255,255,255,0.06)"}`,
        borderRadius: 8,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: hover ? glow : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hover && (
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            animation: "scanLine 1.5s ease-in-out infinite",
          }}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: 14, fontWeight: 700,
            color: hover ? accent : "#e8e8ff", letterSpacing: "0.05em",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {glitchName}
          </span>
          <span style={{
            fontSize: 9, fontFamily: "'Share Tech Mono', monospace", padding: "2px 5px",
            border: `1px solid ${badgeColors[tool.badge] || accent}`,
            color: badgeColors[tool.badge] || accent, borderRadius: 3,
            letterSpacing: "0.1em", flexShrink: 0,
          }}>
            {tool.badge}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0, marginLeft: 6 }}>
          <span style={{
            fontSize: 9, padding: "2px 6px", borderRadius: 3,
            fontFamily: "'Share Tech Mono', monospace",
            background: `${langColors[tool.lang] || "#555"}33`,
            color: langColors[tool.lang] || "#aaa",
            border: `1px solid ${langColors[tool.lang] || "#555"}55`,
          }}>
            {tool.lang}
          </span>
          {tool.stars !== "N/A" && (
            <span style={{ fontSize: 9, color: "#666", fontFamily: "'Share Tech Mono', monospace" }}>
              ★ {tool.stars}
            </span>
          )}
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#8888aa", margin: "0 0 10px", lineHeight: 1.5, fontFamily: "'Space Grotesk', sans-serif" }}>
        {tool.desc}
      </p>

      {/* FIX 3: single border prop — no more border + borderColor conflict */}
      <div
        onClick={copy}
        style={{
          background: "rgba(0,0,0,0.5)",
          border: copyBorder,
          borderRadius: 5,
          padding: "6px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "copy",
          transition: "border 0.2s",
        }}
      >
        <code style={{
          fontSize: 10, color: copied ? accent : "#aaccff",
          fontFamily: "'Share Tech Mono', monospace",
          flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          $ {tool.cmd}
        </code>
        <span style={{ fontSize: 9, color: copied ? accent : "#555", marginLeft: 8, whiteSpace: "nowrap" }}>
          {copied ? "COPIED ✓" : "COPY"}
        </span>
      </div>
    </div>
  );
}

function CategoryPanel({ catKey, data }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
          cursor: "pointer", userSelect: "none",
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 6, display: "flex",
          alignItems: "center", justifyContent: "center",
          background: `${data.color}15`, border: `1px solid ${data.color}44`, fontSize: 14,
        }}>
          {data.icon}
        </div>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
          letterSpacing: "0.2em", color: data.color, textTransform: "uppercase",
        }}>
          {data.label}
        </span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${data.color}33, transparent)` }} />
        <span style={{ fontSize: 10, color: "#555", fontFamily: "'Share Tech Mono', monospace" }}>
          [{data.tools.length}] {expanded ? "▲" : "▼"}
        </span>
      </div>
      {expanded && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
          {data.tools.map((t) => (
            <ToolCard key={`${catKey}-${t.name}`} tool={t} accent={data.color} glow={data.glow} />
          ))}
        </div>
      )}
    </div>
  );
}

// FIX 4 & 5 & 6: ordre de déclaration corrigé + try/catch + ctx null-guard
function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // FIX 6: guard ctx null (GPU désactivé, etc.)

    const chars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF";
    let drops = [];

    // FIX 4: déclaré AVANT resize() pour éviter le ReferenceError (TDZ avec const)
    const initDrops = () => {
      const cols = Math.floor(canvas.width / 18) || 1;
      drops = Array(cols).fill(1);
    };

    // FIX 4: use window dimensions instead of offsetWidth/Height (canvas is position:fixed)
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDrops();
    };
    resize();
    window.addEventListener("resize", resize);

    // FIX 5: wait for font to be ready before drawing
    const startAnimation = () => {
      ctx.font = "13px 'Share Tech Mono', monospace";
      const interval = setInterval(() => {
        try {
          ctx.fillStyle = "rgba(4,4,12,0.06)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.font = "13px 'Share Tech Mono', monospace";
          drops.forEach((y, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const alpha = Math.random() > 0.95 ? 1 : 0.15;
            ctx.fillStyle = `rgba(0,245,255,${alpha})`;
            ctx.fillText(char, i * 18, y * 18);
            if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
          });
        } catch (_) { /* canvas détaché / contexte perdu — silencieux */ }
      }, 50);
      return interval;
    };

    let interval;
    // FIX 5: use document.fonts.ready to ensure font is loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        interval = startAnimation();
      });
    } else {
      interval = startAnimation();
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, width: "100%", height: "100%",
        opacity: 0.04, zIndex: 0, pointerEvents: "none",
      }}
    />
  );
}

function TerminalLine({ text, color = "#00f5ff", delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      opacity: vis ? 1 : 0, transition: "opacity 0.3s",
      fontFamily: "'Share Tech Mono', monospace", fontSize: 10,
      color, marginBottom: 2,
    }}>
      {text}
    </div>
  );
}

export default function HackDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  // FIX 6: removed unused 'pulse' state
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const totalTools = Object.values(tools).reduce((s, c) => s + c.tools.length, 0);

  const filteredCats = categoryList
    .filter((k) => activeTab === "all" || activeTab === k)
    .reduce((acc, k) => {
      const cat = tools[k];
      const q = search.toLowerCase();
      const filtered = cat.tools.filter(
        (t) =>
          !search ||
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.badge.toLowerCase().includes(q) ||
          t.lang.toLowerCase().includes(q)
      );
      if (filtered.length) acc[k] = { ...cat, tools: filtered };
      return acc;
    }, {});

  return (
    <div style={{
      minHeight: "100vh", background: "#04040c",
      fontFamily: "'Space Grotesk', sans-serif", color: "#e0e0ff",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes scanLine { 0%,100%{transform:translateX(-100%)} 50%{transform:translateX(100%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #08080f; }
        ::-webkit-scrollbar-thumb { background: #00f5ff33; border-radius: 2px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #334; }
      `}</style>

      <MatrixRain />

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: -200, left: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -150, right: -150, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(191,95,255,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* TOP NAV */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(4,4,12,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,245,255,0.12)",
        padding: "0 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #00f5ff22, #bf5fff22)",
            border: "1px solid #00f5ff44", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 16, animation: "float 3s ease-in-out infinite",
          }}>
            ⚠
          </div>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, fontWeight: 700, color: "#00f5ff", letterSpacing: "0.15em" }}>
              0xATLAS
            </div>
            <div style={{ fontSize: 8, color: "#445", letterSpacing: "0.2em", fontFamily: "'Share Tech Mono', monospace" }}>
              OFFENSIVE SECURITY TOOLKIT
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff88", animation: "pulse 2s infinite", display: "inline-block" }} />
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#00ff88" }}>SYS ONLINE</span>
          <span style={{ marginLeft: 16, fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#445" }}>
            {time.toLocaleTimeString("fr-FR")}
          </span>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#444", letterSpacing: "0.1em" }}>
            {totalTools} OUTILS · {Object.keys(tools).length} CATÉGORIES
          </span>
          <div style={{
            padding: "5px 14px", border: "1px solid #ff336644",
            borderRadius: 4, fontSize: 10, color: "#ff3366",
            fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em",
          }}>
            ⚡ ETHICAL USE ONLY
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)", position: "relative", zIndex: 1 }}>

        {/* SIDEBAR */}
        <div style={{
          width: 220, flexShrink: 0,
          background: "rgba(6,6,14,0.8)", backdropFilter: "blur(10px)",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          padding: "20px 0", position: "sticky", top: 56,
          height: "calc(100vh - 56px)", overflowY: "auto",
        }}>
          {/* Terminal block */}
          <div style={{
            margin: "0 12px 20px", background: "rgba(0,0,0,0.5)",
            borderRadius: 6, border: "1px solid rgba(0,245,255,0.1)", padding: 10,
          }}>
            <TerminalLine text="> init 0xATLAS.sh" color="#00f5ff" delay={100} />
            <TerminalLine text="> loading modules..." color="#666" delay={400} />
            <TerminalLine text={`> [OK] ${totalTools} tools loaded`} color="#00ff88" delay={800} />
            <TerminalLine text="> [OK] ready" color="#00ff88" delay={1100} />
          </div>

          {/* Nav */}
          <div style={{ padding: "0 8px" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.3em", color: "#333", padding: "0 8px 8px", fontFamily: "'Share Tech Mono', monospace" }}>
              NAVIGATION
            </div>
            {[
              { key: "all", label: "ALL TOOLS", icon: "◉", color: "#00f5ff" },
              ...categoryList.map((k) => ({ key: k, label: tools[k].label, icon: tools[k].icon, color: tools[k].color })),
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", borderRadius: 6, cursor: "pointer",
                  marginBottom: 2, transition: "all 0.2s",
                  background: activeTab === item.key ? `${item.color}15` : "transparent",
                  border: `1px solid ${activeTab === item.key ? item.color + "44" : "transparent"}`,
                }}
              >
                <span style={{ fontSize: 12, width: 16, textAlign: "center" }}>{item.icon}</span>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace", fontSize: 9.5,
                  letterSpacing: "0.08em",
                  color: activeTab === item.key ? item.color : "#667",
                }}>
                  {item.label}
                </span>
                {item.key !== "all" && (
                  <span style={{ marginLeft: "auto", fontSize: 8, color: "#333", fontFamily: "'Share Tech Mono', monospace" }}>
                    {tools[item.key].tools.length}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Stack breakdown */}
          <div style={{ margin: "20px 12px 0", padding: 10, background: "rgba(0,0,0,0.4)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "#333", fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>
              STACK BREAKDOWN
            </div>
            {[
              ["Python", 37, "#3572A5"],
              ["Go", 12, "#00ADD8"],
              ["C/C++", 28, "#555"],
              ["Ruby", 5, "#701516"],
              ["Other", 18, "#888"],
            ].map(([lang, pct, col]) => (
              <div key={lang} style={{ marginBottom: 5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 8, color: "#556", fontFamily: "'Share Tech Mono', monospace" }}>{lang}</span>
                  <span style={{ fontSize: 8, color: col, fontFamily: "'Share Tech Mono', monospace" }}>{pct}%</span>
                </div>
                <div style={{ height: 2, background: "#111", borderRadius: 1 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 1, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.3em", color: "#445", marginBottom: 4 }}>
              // OFFENSIVE SECURITY · OPEN SOURCE ARSENAL
            </div>
            <h1 style={{
              fontSize: 28, fontWeight: 600, letterSpacing: "0.05em",
              background: "linear-gradient(135deg, #00f5ff, #bf5fff)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontFamily: "'Share Tech Mono', monospace", marginBottom: 4,
            }}>
              PENTEST ARSENAL
            </h1>
            <p style={{ fontSize: 12, color: "#4488aa" }}>
              {totalTools} outils open source classifiés par catégorie d'attaque — usage légal &amp; éthique uniquement
            </p>
          </div>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 24,
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,245,255,0.15)",
            borderRadius: 8, padding: "10px 16px",
            boxShadow: search ? "0 0 20px rgba(0,245,255,0.1)" : "none",
            transition: "box-shadow 0.3s",
          }}>
            <span style={{ color: "#00f5ff", fontSize: 14, flexShrink: 0 }}>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un outil, une technique, un langage..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#e0e0ff", fontFamily: "'Share Tech Mono', monospace", fontSize: 12,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 14 }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
            {[
              { label: "OUTILS", value: totalTools, color: "#00f5ff" },
              { label: "CATÉGORIES", value: Object.keys(tools).length, color: "#bf5fff" },
              { label: "STARS GITHUB", value: "750k+", color: "#ffaa00" },
              { label: "LANGAGES", value: "10", color: "#00ff88" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "rgba(8,8,16,0.8)", border: `1px solid ${s.color}22`,
                borderRadius: 8, padding: "12px 16px", textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 22, fontWeight: 700, color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: "#445", letterSpacing: "0.2em", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tool grid */}
          {Object.keys(filteredCats).length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "'Share Tech Mono', monospace" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⊘</div>
              <div>Aucun outil trouvé pour "{search}"</div>
            </div>
          ) : (
            Object.entries(filteredCats).map(([k, data]) => (
              <CategoryPanel key={k} catKey={k} data={data} />
            ))
          )}

          {/* Disclaimer */}
          <div style={{
            marginTop: 32, padding: 16,
            background: "rgba(255,51,102,0.04)",
            border: "1px solid rgba(255,51,102,0.15)",
            borderRadius: 8, display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#ff3366", marginBottom: 4, letterSpacing: "0.1em" }}>
                AVERTISSEMENT LÉGAL
              </div>
              <p style={{ fontSize: 11, color: "#667", lineHeight: 1.6 }}>
                Ces outils sont destinés exclusivement aux{" "}
                <strong style={{ color: "#aaa" }}>tests d'intrusion autorisés</strong>, à la formation en cybersécurité et à la recherche en sécurité défensive. Toute utilisation non autorisée contre des systèmes tiers est illégale. Utilisez uniquement sur des environnements dont vous êtes{" "}
                <strong style={{ color: "#aaa" }}>propriétaire ou pour lesquels vous avez une autorisation écrite explicite</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
