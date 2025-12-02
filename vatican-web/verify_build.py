from playwright.sync_api import sync_playwright
import os

def verify_build_index():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the built index.html using file:// protocol
        # Note: In this environment, we might not have a GUI to render file:// easily if permissions are strict,
        # but Playwright can handle it.
        cwd = os.getcwd()
        file_path = f"file://{cwd}/vatican-web/dist/index.html"
        print(f"Navigating to {file_path}")
        page.goto(file_path)

        # Verify Header
        print("Verifying header...")
        page.wait_for_selector("text=Ecclesia Gallia")

        # Bible should work immediately as it is bundled
        print("Switching to Bible view...")
        page.click("button:has-text('Bible')")

        page.wait_for_selector("text=Genesis 1")
        print("Bible loaded successfully from bundle.")

        # Take screenshot
        page.screenshot(path="/home/jules/verification_build/build_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_build_index()
