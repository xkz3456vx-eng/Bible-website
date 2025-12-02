from playwright.sync_api import sync_playwright
import os

def verify_classic():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate via file:// protocol
        cwd = os.getcwd()
        file_path = f"file://{cwd}/vatican-classic/index.html"
        print(f"Navigating to {file_path}")
        page.goto(file_path)

        # Verify Header
        print("Verifying header...")
        page.wait_for_selector("text=Ecclesia Gallia")

        # Verify Bible (It should work immediately as data is a JS variable)
        print("Switching to Bible view...")
        page.click("#btn-bible")

        page.wait_for_selector("text=Genesis 1")
        print("Bible loaded successfully.")

        # Take screenshot
        page.screenshot(path="/home/jules/verification_classic/classic_bible.png")

        browser.close()

if __name__ == "__main__":
    verify_classic()
