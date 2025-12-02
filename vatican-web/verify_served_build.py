from playwright.sync_api import sync_playwright

def verify_served_build():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the locally served build
        print("Navigating to http://localhost:8000")
        page.goto("http://localhost:8000")

        # Verify Header exists
        print("Verifying header...")
        page.wait_for_selector("text=Ecclesia Gallia")

        # Take a screenshot of the initial view
        page.screenshot(path="/home/jules/verification_served/initial_view.png")
        print("Initial screenshot taken.")

        # Switch to Bible view
        print("Switching to Bible view...")
        page.click("button:has-text('Bible')")

        # Ensure Bible content loads (Genesis 1)
        page.wait_for_selector("text=Genesis 1")
        print("Bible loaded successfully from bundle.")

        # Take screenshot of the Bible view
        page.screenshot(path="/home/jules/verification_served/bible_view.png")
        print("Bible view screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_served_build()
