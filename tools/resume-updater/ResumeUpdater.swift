import AppKit
import Foundation

enum ResumeMode {
    case chinese
    case english
    case both
}

func showAlert(title: String, message: String, buttons: [String]) -> NSApplication.ModalResponse {
    let alert = NSAlert()
    alert.messageText = title
    alert.informativeText = message
    alert.alertStyle = .informational
    for button in buttons {
        alert.addButton(withTitle: button)
    }
    return alert.runModal()
}

func chooseMode() -> ResumeMode? {
    let response = showAlert(
        title: "Resume Updater",
        message: "Which resume would you like to update?",
        buttons: ["Chinese", "English", "Both", "Cancel"]
    )

    switch response {
    case .alertFirstButtonReturn:
        return .chinese
    case .alertSecondButtonReturn:
        return .english
    case .alertThirdButtonReturn:
        return .both
    default:
        return nil
    }
}

func choosePDF(prompt: String) -> URL? {
    let panel = NSOpenPanel()
    panel.title = prompt
    panel.prompt = "Choose PDF"
    panel.canChooseDirectories = false
    panel.canChooseFiles = true
    panel.allowsMultipleSelection = false
    panel.allowedContentTypes = [.pdf]
    return panel.runModal() == .OK ? panel.url : nil
}

func warnIfLarge(_ url: URL, label: String) {
    let size = (try? FileManager.default.attributesOfItem(atPath: url.path)[.size] as? NSNumber)?.int64Value ?? 0
    let threshold: Int64 = 5 * 1024 * 1024
    guard size > threshold else { return }

    let mb = Double(size) / 1024.0 / 1024.0
    _ = showAlert(
        title: "Large PDF Notice",
        message: String(format: "%@ resume is %.1f MB. The app will keep a raw backup and update the runtime PDF, but you may want to compress it later for faster download.", label, mb),
        buttons: ["Continue"]
    )
}

func projectRoot() -> URL {
    let bundleURL = Bundle.main.bundleURL
    return bundleURL.deletingLastPathComponent().deletingLastPathComponent()
}

func runCommand(_ args: [String], root: URL) throws -> (status: Int32, output: String) {
    let process = Process()
    process.executableURL = URL(fileURLWithPath: "/usr/bin/env")
    process.arguments = args
    process.currentDirectoryURL = root

    let pipe = Pipe()
    process.standardOutput = pipe
    process.standardError = pipe

    try process.run()
    process.waitUntilExit()

    let data = pipe.fileHandleForReading.readDataToEndOfFile()
    let output = String(data: data, encoding: .utf8) ?? ""
    return (process.terminationStatus, output)
}

func runUpdater(root: URL, cnURL: URL?, enURL: URL?, shouldBuild: Bool) throws -> String {
    let scriptURL = root.appendingPathComponent("scripts/update-resume.sh")
    var args = ["bash", scriptURL.path]

    if let cnURL {
        args.append(contentsOf: ["--cn", cnURL.path])
    }
    if let enURL {
        args.append(contentsOf: ["--en", enURL.path])
    }
    args.append(shouldBuild ? "--build" : "--no-build")

    let result = try runCommand(args, root: root)
    if result.status != 0 {
        throw NSError(
            domain: "ResumeUpdater",
            code: Int(result.status),
            userInfo: [NSLocalizedDescriptionKey: result.output.isEmpty ? "Updater script failed." : result.output]
        )
    }
    return result.output
}

/// Try git add -A, commit, push. Returns a human-readable summary.
func gitCommitAndPush(root: URL) -> String {
    // Only proceed if updater script touched resume assets or index.html
    let (status, _) = (try? runCommand(["git", "status", "--short"], root: root)) ?? (-1, "")
    guard status == 0 else { return "Git not available — commit manually." }

    _ = try? runCommand(["git", "add", "-A"], root: root)

    let commitMsg = "chore: update resume PDFs"
    let (commitStatus, commitOut) = (try? runCommand(["git", "commit", "-m", commitMsg], root: root)) ?? (-1, "")
    if commitStatus != 0 {
        return "Commit skipped (nothing to commit or git error).\n\(commitOut)"
    }

    let (pushStatus, pushOut) = (try? runCommand(["git", "push", "github", "main"], root: root)) ?? (-1, "")
    if pushStatus != 0 {
        return "Commit OK, but push failed.\n\(pushOut)\n\nPush manually with: git push github main"
    }

    return "Committed & pushed to GitHub. ✓"
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)
app.activate(ignoringOtherApps: true)

guard let mode = chooseMode() else {
    app.terminate(nil)
    exit(0)
}

var cnURL: URL?
var enURL: URL?

switch mode {
case .chinese:
    cnURL = choosePDF(prompt: "Choose the new Chinese resume PDF")
case .english:
    enURL = choosePDF(prompt: "Choose the new English resume PDF")
case .both:
    cnURL = choosePDF(prompt: "Choose the new Chinese resume PDF")
    if cnURL != nil {
        enURL = choosePDF(prompt: "Choose the new English resume PDF")
    }
}

if let cnURL {
    warnIfLarge(cnURL, label: "Chinese")
}
if let enURL {
    warnIfLarge(enURL, label: "English")
}

if cnURL == nil && enURL == nil {
    app.terminate(nil)
    exit(0)
}

let buildResponse = showAlert(
    title: "Local Build",
    message: "Do you want to try a local build after updating? If Node.js is not available, Cloudflare can still build after GitHub push.",
    buttons: ["Update Only", "Update + Build"]
)
let shouldBuild = buildResponse == .alertSecondButtonReturn

do {
    let output = try runUpdater(root: projectRoot(), cnURL: cnURL, enURL: enURL, shouldBuild: shouldBuild)

    let gitResponse = showAlert(
        title: "Resume Updated",
        message: "\(output)\n\nWould you like to commit and push to GitHub?",
        buttons: ["Done", "Commit & Push"]
    )

    var finalMessage = output
    if gitResponse == .alertSecondButtonReturn {
        let gitResult = gitCommitAndPush(root: projectRoot())
        finalMessage += "\n\n\(gitResult)"
    }

    _ = showAlert(title: "Resume Update Complete", message: finalMessage, buttons: ["OK"])
} catch {
    _ = showAlert(title: "Resume Update Failed", message: error.localizedDescription, buttons: ["OK"])
}

app.terminate(nil)
