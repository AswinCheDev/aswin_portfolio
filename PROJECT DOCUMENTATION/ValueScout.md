
```markdown
# 1 Introduction
This project is all about making online shopping in India much simpler and smarter. Today, if a person, eagers to buy something online, they often have to visit many different websites, like Amazon, Flipkart, or even multiple e-commerce platforms. This takes a lot of time and can be confusing, as the shopper have to remember prices and compare products from each multiple sites, this process can be hectic.

The major part of this project is to create a single, easy-to-use platform where the shoppers can find everything that shoppers need from almost any online stores in India. This system works by quickly searching through lots of different online shops at the same time. This means when the shoppers look for a product, the shopper can see the choices and their current prices on one a respective webapp at once. This helps shopper save time, compare things easily, and feel more confident about what you buy. It also includes several key features to make this a truly unique tool for finding products from multiple sites. This project aims to build a search tool that gathers product listings from many online stores in India and around the globe. It will also includes a AI Recommendation tool that acts as a personal stylist or the personalized style builder; if shopper picks an item, like a pair of shoes, it will suggest other clothes that match perfectly, helping shoppers create a complete outfit or the best matching fit with the shoe. Finally, this system also includes an automatic price-drop alert that watches prices and sends an push email notification and also a pop-up message to the screen stating the price is tracked when a product gets cheaper, so a shopper can buy it at the best possible time.

This project aims to turn the sometimes-confusing, hectic experience of online shopping into something that's easy, and even interesting. In addition, this project emphasizes simplicity, speed, and intelligence at the entry level of the shopping experience. By bringing product discovery, price comparison, personalized AI styling, and automated alerts into a single platform, it reduces decision fatigue for users. The goal is to help shoppers start their buying journey with clarity and confidence, transforming online shopping from a scattered search process into a smooth and guided experience from the very first interaction.

## 1.1 Aim
The aim is to develop a user-friendly website e-commerce that becomes the go-to platform for Indian shoppers to easily find and compare products from across the internet.

## 1.2 Objectives
* To integrate a search facility, a single search tool will be built that gathers product and price information from many of India's top online stores.
* To compare prices, the platform will enable users to easily compare real-time prices across all e-commerce retailers, ensuring they find the best deals.
* To create a personalized recommendation and styling tool, a smart system will look at a product you like and suggest other clothing items that match it.
* To set up price alerts, an automatic system will send an email alert or push notifications when the price of a product you are watching goes down.
* To make an easy-to-use website, a simple design will allow user to easily browse, filter, and compare products from many different stores on one screen.

## 1.3 Feasibility Study
* **Market Feasibility:** The Indian online shopping market is huge and so it is growing very fast. Many customers are still looking for a simple way to compare products from different stores. This platform fills this gap by offering a single place to purchase and shop, which makes our idea very strong.
* **Technical Feasibility:** The technology needed is complex but achievable. We will use existing tools for collecting data from websites and will build a smart AI to help with style. These technologies are well-known and can be successfully developed.
* **Operational Feasibility:** We can build and manage this WebApp with a team that has the right skills in web development. We will also need to regularly maintain the system to keep it working smoothly.
* **Financial Feasibility:** The project is financially feasible. As most of the technologies that will be used to building this is project are free of cost.

## 1.4 Problem Definition
* Shopping online is frustrating because the market is spread across many platforms. To find a single product, consumer or shoppers have to visit and search on multiple websites, which wastes time and makes it hard to hard to choose best choice.
* E-commerce platforms focus on selling individual items rather than helping people create complete outfits. Online stores sell products without offering styling advice, leaving shoppers unsure about how to wear an item and less confident in their purchase.
* Online prices change often. To find the best deal, shoppers must constantly check prices on many different websites, which is time consuming.
* Most price comparison tools are confusing and full of ads. They don't offer a clean and smooth shopping experience. There's no platform that combines useful price comparison with a modern design that shoppers want.

## 1.5 Software Requirements Specification (SRS)

### Functional Requirements
**R1. User Authentication:**
A user-friendly interface for the users to log in or register with credentials for authentication.
* **Input:** Username, Email, Password
* **Output:** Authenticated user session with access to the system
* **Process:** Verify user identity by matching credentials with the database.

**R2. Product Search & Aggregation:**
The system allows users to search for products and retrieves results from multiple e-commerce platforms.
* **Input:** User search query (product name or URL)
* **Output:** Aggregated list of product details and prices
* **Process:** System fetches data from external e-commerce platforms, aggregates, and displays results.

**R3. Price Comparison:**
The system compares product prices from different platforms and shows the best deal.
* **Input:** Product request (selected product by the user)
* **Output:** Comparison result showing price variations across platforms.
* **Process:** Retrieve product prices, compare them and show the comparison output.

**R4. AI Recommendation System:**
The system suggests relevant products to users based on their current search queries, product attributes, and available platform data.
* **Input:** User input (search queries, selected product details) and product attributes from external platforms
* **Output:** Recommended products matching user interest or similar alternatives
* **Process:** AI model analyses product data (features, prices, popularity) in relation to user input and generates recommendation.

**R5. Price Alert Monitoring & Notifications:**
Users can set alerts for products at desired price thresholds and the system monitors price updates and sends notifications when user-defined conditions are met.
* **Input:** Product price updates from e-commerce platforms
* **Output:** Notifications (Email, SMS, or In-App) to users
* **Process:** Compare updated price with alert rules, trigger alerts, and send notifications.

### Non-Functional Requirements
* **Compatibility:** Our web-based application provides compatibility with different web browsers & responsiveness across devices. It uplifts the consistent user experience.
* **Scalability:** Utilization of design which can make the system to be scalable to accommodate an increasing no. of users.
* **Usability:** The interface is user-friendly, allowing non-technical users to search, compare, and set alerts easily.
* **Security:** It maintains accessibility standards; data protection & privacy regulation have increased the security.
* **Availability:** It will provide a platform without any subscription/cost. User can freely avail the system.
* **Performance:** The system shall respond to product search and price comparison requests within 3–5 seconds under normal conditions.

## 1.6 Proposed Solution Strategy
To address the current issue below are the strategies listed below:
* This platform is a single search engine for the Indian e-commerce market. It aggregates real-time product listings from major and small retailers, letting users easily compare products and prices to make the best purchase decisions.
* The platform’s AI acts as a personal stylist, recommending complementary apparel to help users create a complete outfit and build their personal style.
* A simple notification feature lets users subscribe to price alerts with a single click. The platform then automatically monitors prices and sends an email when a discount is detected, ensuring users get the best price.
* This platform combines powerful price comparison with a clean, ad-free interface. It transforms online shopping from a simple task into an inspiring journey of style discovery.

## 1.7 Survey

| Developer | System Name | Findings | Relevance | Limitations |
| :--- | :--- | :--- | :--- | :--- |
| Karma [1] | Karma (formerly Shoptagr) | A shopping assistant tool (browser extension/app) that allows users to save items from various stores to a universal wishlist and receive price drop notifications.<br><br>**Technology Stack used for price alerts:**<br>Working of frontend: The extension scrapes the product metadata (title, price, image, store link) using DOM parsing or APIs exposed by the retailer, then pushes it to Karma’s backend.<br>Web Scraping Services: BeautifulSoup + Requests (Python) for price and stock monitoring.<br>Task Scheduling: Celery, RabbitMQ, Kafka, or Cron jobs regularly check product pages for updates.<br>Notifications:<br>- Push Notifications: Firebase Cloud Messaging (FCM) / Apple Push Notification Service (APNs)<br>- Email Alerts: SendGrid<br>Browser Alerts: WebSockets | The system's core function validates the user need for cross-platform price-drop notifications, a key feature in our vision. | It's a utility, not a discovery platform; it lacks a centralized search engine. Crucially, it is not Indian market-centric, with limited support for Indian retailers. |
| GirnarSoft [2] | PriceDekho | A price comparison engine that aggregates product listings and prices from a wide network of Indian e-commerce sites, allowing users to find the cheapest option.<br><br>**Technology Stack used for price comparison:**<br>1. Data Collection: Web scraping (BeautifulSoup) & official API<br>2. Data Cleaning: Normalization<br>3. Product Matching: Matching key attributes like brand, model, size, color, UPC (Universal Product Code)<br>4. Price Comparison by system, it compares product price & discounts | Its model is directly relevant to our core concept of a centralized search engine that aggregates data from the entire Indian market, proving its viability. | PriceDekho's primary focus is on functional price comparison, not style or curation. Its user interface is typically utilitarian and lacks the "premium, aesthetically pleasing" quality you envision. Most importantly, it completely lacks any form of AI-driven styling or recommendation engine like your 'Personalized Style Builder'. Its purpose is to find the cheapest price, not to help build a cohesive look. |
| OpenAI (Alec Radford et al.) [3] | CLIP (Contrastive Language–Image Pretraining) | The study demonstrates that visual models trained using natural language supervision can learn transferable representations and perform well across multiple vision tasks without task-specific training. | Relevant for AI-driven recommendation and style analysis systems, as it enables understanding of visual content (products, clothing) using text–image relationships. | Performance depends on large-scale datasets, may inherit biases from training data, and is less precise for fine-grained or domain-specific visual tasks. |
| Francesco Ricci, Lior Rokach, Bracha Shapira (2015) [4] | AI-Based Recommendation System (Research Study / Survey Paper) | The study shows that AI and machine learning techniques enhance personalized recommendations by analyzing user behavior, preferences, and historical data. | Helps in generating personalized product and style recommendations for e-commerce platforms. | Faces challenges such as cold-start issues, data sparsity, and dependence on large, high-quality datasets. |
| Shikha Singh, Garima Srivastava, Vandana Dubey & G. R. Mishra (2023) | Price Comparison and Email Alert System Using Web Scraping (Research Chapter, Springer) | Web scraping effectively extracts real-time product prices and triggers automated email alerts when prices drop below a set threshold. | Useful for implementing price-drop alert and notification systems in e-commerce comparison platforms. | Scraping depends on website structure, may fail if layouts change, and can face legal, ethical, and scalability challenges. |

*Table 1: Survey*

# 2. Project Plan

## 2.1 Hardware Specifications & Software Specifications

**Hardware Specifications**
* Memory 8GB RAM
* Processor: Intel Core i3 (or above) 10th Gen
* Storage: 256GB SSD
* Graphics Card: Equivalent to GTX 1650 or higher

**Software Specifications**
* Operating System: Windows 10/11 (64-bit)
* Frontend: HTML5, CSS3, JavaScript, TailwindCSS
* Backend: Node.js, Express.js, Python, Flask
* AI/ML: Python 3.13, Flask, Pandas, NumPy, TensorFlow, PyTorch, Scikit-learn, CLIP (Contrastive Language-Image Pre-training)
* Web Scrapping: Playwright, SerpApi
* Database: MongoDB (Mongoose 8.20.2)
* Development Tools: VS Code
* Email Service: Nodemailer
* API Testing: Postman
* Version Control & Collaboration: Github, Git

## 2.2 Team Structure

| Role | Name | ID |
| :--- | :--- | :--- |
| Guide | Dr. Sumon Dey | |
| Student | Samarpan Dahal | 202422003 |
| Student | Aswin Chettri | 202422006 |
| Student | Moyuk Rudra | 202422016 |

*Fig. 1: Team Structure*

## 2.3 SDLC (in case of Application Development)

Iterative Waterfall Model stages:
1. Feasibility Study
2. Requirement Analysis and Specification
3. Design
4. Coding and Unit Testing
5. Integration and System Testing
6. Maintenance

*Fig. 3: Iterative Waterfall Model*

## 2.3 Gantt Chart (Project Schedule)

| Activities | 04 Aug – 30 Aug | 31 Aug – 25 Sept | 26 Sep – 21 Oct | 22 Oct – 16 Nov | 17 Nov – 16 Dec |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Feasibility Study | Expected/Achieved | | | | |
| Requirement Gathering & Analysis | | Expected/Achieved | | | |
| Survey | | Expected/Achieved | | | |
| Interface Design (UI/UX) | | | Expected/Achieved | | |
| Backend & Database Development | | | Expected/Achieved | | |
| Integration of Frontend & Backend | | | | Expected/Achieved | |
| Testing and Validation | | | | Expected/Achieved | |
| Documentation | | | | | Expected/Achieved |

*Fig.2: Gantt chart*

# 3. Design Strategy for the Solution

## 3.1 Context Level Diagram (Level 0)
*Fig 4: Level 0 DFD*

## 3.2 Level 1 Data Flow Diagram
*Fig 5: Level 1 DFD*

## 3.3 Level 2 Data Flow Diagram
### 3.3.1 Product Search & Aggregation
*Fig 6: Level 2 DFD (Product Search & Aggregation)*

### 3.3.2 Price Comparison
*Fig 7: Level 2 DFD (Price Comparison)*

### 3.3.3 AI Recommendation System
*Fig 8: Level 2 DFD (AI Recommendation System)*

### 3.3.4 Price Alert & Notification System
*Fig 9: Level 2 DFD (Price Alert & Notification System)*

## 3.4 Sequence diagram (when user clicks ai style builder icon)
*Fig 10: Sequence diagram (when user clicks ai style builder icon)*

## 3.5 Activity Diagram for Offline Data Processing
*Fig 11: Offline Data Processing Pipeline Diagram*

# 4. Implementation Details

## 4.1. Pseudo Code
Following are the pseudo codes of some of the important algorithms used in developing the web application:

### 4.1.1. Pseudo Code for User Registration
```text
Start
      Prompt user to input valid sign-up details
      On clicking "sign-up" button
         If (all the input details are valid)
           Add user details into the database and display "Registration Successful"
         Else
              Display Error Message
         End If
End

```

### 4.1.2. Pseudo Code for User login

```text
Start
       If (Id/Password verified)
       Direct to Homepage
       Else
             Display "Invalid Id/Password"
       End If
End

```

### 4.1.3. Pseudo Code for Product Search & Aggregation

```text
Start
    Read the user’s search query
    If the query is empty
       Display "Missing search query"
       Stop
    End If
    Send a request to SerpAPI with the search query
    Receive Amazon search results
    Extract product details from each Amazon result:
        - ASIN
        - Title
        - Link
        - Price
        - Thumbnail
        - Rating
        - Reviews
        - Source = "Amazon"
    Store all extracted Amazon products in a list
    Call Myntra scraper with the same search query
    Receive Myntra results
    Extract product details from each Myntra result:
        - Title
        - Link
        - Price
        - Thumbnail
        - Rating
        - Source = "Myntra"
    Add all Myntra products to the same list
    Combine Amazon and Myntra results into a single aggregated list
    Return the aggregated product list to the user
End

```

### 4.1.4. Pseudo Code for Price Comparison

```text
Start
    Read the product ID or search keyword
    Fetch product details from Amazon
    Extract the current Amazon price
    Fetch product details from Myntra
    Extract the current Myntra price
    If both website responses are empty
       Display "No product data found"
       Stop
    End If
    If only one website has the product
       Display the available price
       Stop
    End If
    Compare Amazon price and Myntra price
    If Amazon price < Myntra price
       Display "Amazon has the lower price"
       Display the Amazon price
    Else If Myntra price < Amazon price
       Display "Myntra has the lower price"
       Display the Myntra price
    Else
       Display "Both prices are the same"
    End If
End

```

### 4.1.5. Pseudo Code for AI Recommendation System

```text
Start
    Read the product ID
    Retrieve the product record from the database
    If product = NULL
        Display "Error: Product not found"
       Stop
    End If
    If product.embedding = NULL
        Display "Error: Embedding missing"
        Stop
    End If
    input_category = product.category
    target_categories = OUTFIT_RULES[input_category]
    If target_categories = EMPTY
        Display "No compatible categories available"
        Stop
    End If
    candidates = fetch all products where
                 category ∈ target_categories AND
                 id ≠ product_id AND
                 embedding exists
    If candidates = EMPTY
        Display "No matching candidates found"
        Stop
    End If

    candidate_embeddings = extract embeddings from candidates
    scores = compute cosine similarity between
             product.embedding and candidate_embeddings
    ranked = sort candidates by scores in descending order
    top_results = first 5 items of ranked
    Display top_results
End

```

### 4.1.6. Pseudo Code for Price Alert & Notification System

```text
Start
    Read the user ID and the product to be tracked
    Read the user’s target price for the product

    Store the product and target price in the tracking table
    Periodically (via cron job):
        Fetch all tracked products from the database
        For each tracked product:
            Fetch the current price from ecommerce sources
            Normalize and clean the fetched price
            If current price <= target price
                Save a notification entry in the database
                Mark status as "Price Dropped"
            Else
                Continue checking the next product
            End If
        End For
    When user opens notifications:
        Retrieve all unread notifications
        Display the price drop alerts to the user
        When user reads a notification:
            Mark the notification as "read"
        End When
End

```

# 5. Result and Discussion

## 5.1 User Registration Page

*Fig 12: User Registration Page*
*Fig 13: Email Verification for Authentication*
*Fig 14: Email Sent & Verified (Using SMTP)*
*Fig 15: Quick Login Using Google Authentication Sign In*

**Description:** This is the registration page where new users can create a ValueScout account. The form requires users to provide an email, create a password, and confirm it to ensure accuracy. Once the form is complete, users can click the "Create Account" button. The option to sign up using Google is also available.

## 5.2 User Login Page

*Fig 16: User Login*

**Description:** This is the login page of the application, designed for returning users to access their accounts. Users can enter their email and password to sign in. For users who don't have an account, a "Sign Up" link directs them to the registration page. The page also offers alternative sign-in options through third-party services like Google and Apple.

## 5.3 User Home Page

*Fig 17: Snapshot of User Homepage*

**Description:** It Is the home page of the application and provides users with various functionalities such as searching for deals, styles, and categories using the central search bar. Users can also explore newly added items, compare deals, utilize the AI Style Builder, and browse products by category.

## 5.4 Search Page

*Fig 18: Snapshot of Search Page*

**Description:** Users can search any product (example: shoes). Fetches live results with price, ratings, reviews & thumbnails. Each product shows a wishlist-heart icon for instant saving. And clean UI showing multiple results in card-based layout.

## 5.5 Adding to Wishlist

*Fig 19: Snapshot of adding to wishlist*

**Description:** Clicking the red heart adds/removes the item from the wishlist. User’s saved items remain persistent across sessions. Also represents the core interaction before price tracking.

## 5.6 Wishlist Page

*Fig 20: Snapshot of Wishlist Page*

**Description:** Displays all saved items in a dedicated wishlist screen. User can set a target price for each item. System starts tracking automatically once target price is set. Also target price is visually shown beneath each product.

## 5.7 Email Alert System

*Fig 21: Snapshot of Email Alert*

**Description:** Sends combine email if multiple items drop in one cron run. It also includes product image, current price, target price & product link. Avoids duplicate emails by checking previous notification status. And delivered using Gmail SMTP with HTML formatting.

## 5.8 Price Comparison

*Fig 22: Snapshot of Price Comparison*

**Description:** The product comparison module identifies the same product across multiple e-commerce platforms by first scraping structured product details from the selected product’s page. A refined search query is then generated and used to retrieve candidate products from other platforms. Irrelevant items are filtered based on product category, after which matching is performed using perceptual image hashing combined with price proximity and attribute checks. This multi-signal approach reduces dependency on product titles, handles catalogue inconsistencies across platforms, and enables reliable cross-site price comparison.

## 5.9 Price Alert

*Fig 21: Snapshot of Price Drop Alert*

**Description:** This displays a price-drop alert by showing a pop-up message on the screen stating “Price Tracked Successfully” when the product price falls to the user-defined target price.

## 5.10 AI Style Builder

*Fig 23: Snapshot of AI Style Builder*
*Fig 24: Snapshot of AI Style Suggestions*

**Description (Fig 23):** When you search for “Jordan,” the system shows Nike Jordan sneakers such as the Jordan Flight Court and Jordan Max Aura, displaying all available options with prices and sources. When you tap the AI icon on any product car, like the Jordan 5 in the first screenshot, the AI Style Builder analyses the item’s category, colour tone, and overall vibe. Since the base item is a sporty sneaker, the AI generates matching outfit suggestions that stay within the same sporty aesthetic.[6]

**Description (Fig 24):** The second screenshot shows this result: joggers, training T-shirts, sweatshirts, and athletic bottoms from Nike that pair naturally with the selected shoe. Everything recommended fits a coherent “sportwear” theme, keeping the style consistent while giving multiple outfit choices across Pants and T-Shirt categories. This creates a quick outfit builder where users instantly see what complements the sneaker in the real world.

# 6. Summary And Conclusion

## 6.1. Summary of Achievements

“ValueScout - AI-Driven Smart shopping Web App” aimed to provide a user-friendly web-application for a seamless and intelligent shopping experience. Throughout the project, we successfully implemented key features such as product search, AI-based styling recommendations, user authentication, and an organized product display system. Overall, the project achieved its goal of creating a easy, accessible, and efficient shopping platform for users.

## 6.2. Difficulties Encountered During Progress

Despite the progression of our project, there were few problems and hurdles encountered during the process. The primary difficulty was in learning new functionalities of the technology we were not familiar with; this caused us a lot of programming errors. One of the major difficulties we faced was to integrate all project modules into a single system, because when we combined features like product search, AI styling and the backend, many unexpected errors came up and we had to spend lot of time fixing it.

## 6.3. Future Scope of the Project

* The web application can be further developed which can include more functionalities.
* Addition of more type of products.
* This project can be further developed into a mobile application.

## 6.4. Limitations of the Project

* The AI styling recommendations are based on a small dataset, so they may not cover all styles or user needs.
* The product search works well for basic queries but may not perform accurately for complex searches.
* The system does not include advanced features such as payment integration, order tracking, or user reviews.

## 6.5. Conclusion

ValueScout – AI-Driven Smart Shopping Web App is a helpful platform that makes online shopping easier and more personalized for users. The system uses AI to provide styling suggestions, along with a smooth product search and a clean user interface that improves the overall experience. With features like AI recommendations and simple navigation, the application makes it easier for users to find suitable products without wasting time. It helps users find products more easily and creates a smoother overall experience. This project shows how AI can improve online shopping by making it more efficient, accessible, and comfortable for users.

```

```