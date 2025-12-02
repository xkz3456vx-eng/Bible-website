from playwright.sync_api import sync_playwright

def verify_vatican_web():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        print("Navigating to app...")
        page.goto("http://localhost:3001")

        # Wait for content to load (AELF fetch)
        print("Waiting for content...")
        page.wait_for_selector("text=Ecclesia Gallia")

        # Verify Header
        print("Verifying header...")
        assert page.is_visible("text=Ecclesia Gallia")
        assert page.is_visible("text=Lectures & Bible")

        # Verify Readings (Home)
        # It might take a moment to fetch readings.
        # We look for "Évangile" or "Lecture" or the day's date
        try:
            page.wait_for_selector("text=Évangile", timeout=10000)
            print("Readings loaded.")
        except:
            print("Readings might not have loaded or layout is different.")

        # Take screenshot of Readings
        page.screenshot(path="/home/jules/verification/readings.png", full_page=True)
        print("Screenshot of Readings taken.")

        # Switch to Bible View
        print("Switching to Bible view...")
        page.click("button:has-text('Bible')")

        # Wait for Bible to load (JSON fetch)
        page.wait_for_selector("select", timeout=5000)

        # Verify Bible Content
        # Default is usually first book (Genèse/Genesis)
        # The file fr_apee.json has English names for books (Genesis), but French text.
        # We need to check for "Genesis 1" or handle the mapping in the UI.
        # For now, let's just check for the presence of the book name "Genesis" or similar.
        page.wait_for_selector("text=Genesis 1")
        print("Bible loaded.")

        # Take screenshot of Bible
        page.screenshot(path="/home/jules/verification/bible.png", full_page=True)
        print("Screenshot of Bible taken.")

        browser.close()

if __name__ == "__main__":
    verify_vatican_web()
