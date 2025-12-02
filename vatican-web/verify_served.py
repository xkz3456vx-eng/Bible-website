from playwright.sync_api import sync_playwright

def verify_served_build():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to http://localhost:8000")
        page.goto("http://localhost:8000")

        # Verify Header
        print("Verifying header...")
        page.wait_for_selector("text=Ecclesia Gallia")

        # Bible should work immediately as it is bundled
        print("Switching to Bible view...")
        page.click("button:has-text('Bible')")

        page.wait_for_selector("text=Genesis 1")
        print("Bible loaded successfully from bundle.")

        # Take screenshot
        page.screenshot(path="/home/jules/verification_build/served_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_served_build()
