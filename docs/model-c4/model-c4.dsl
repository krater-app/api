workspace "Krater" "Krater is a copy of reddit.com website for learning purposes written with modular monolith and DDD in mind." {
    model {
        guest = person "Guest" "Anyone on the web." "Person"
        
        member = person "Member" "Registered member, which can interact with news feed and other members." "Person"
        
        email = softwaresystem "E-mail System" "Transactional E-mail system like Mailgun" "External System"
    
        krater = softwaresystem "Krater Software" "Allows guest and members to interact with news feed and chat." "Inner System" {
            webApplication = container "Single-Page Application" "Provides all of the Krater functionality to guest and members via their Web Browser." "React.js" "Web Browser"
            
            api = container "API" "Provides endpoints via a JSON/HTTPS API." "Node.js" "Inner System" {
                server = component "Server Module" "Exposes HTTP REST endpoints" "Express/Node.js" "Inner System"
                platformAccess = component "Platform Access Module" "Allows users to register and login" "Node.js Module" "Inner System"
                following = component "Following Module" "Allows members to follow each other" "Node.js Module" "Inner System"
                messaging = component "Messaging Module" "Allows member to chat with each other" "Node.js Module" "Inner System"
                newsFeed = component "News Feed Module" "Allows to read and create posts on news feed" "Node.js Module" "Inner System"
                postAggregator = component "Post Aggregator Module" "Scraps news from other websites" "Node.js Module" "Inner System"
                profile = component "Protfile Module" "Allows members to manage their profiles" "Node.js Module" "Inner System"
                tags = component "Tags Module" "Allows to manage members tags and set subscriptions for tags" "Node.js Module" "Inner System"
                notifications = component "Notifications Module" "Allows to send emails through EDA" "Node.js Module" "Inner System"
            }

            
            storage = container "File Storage" "Stores files like avatars, images etc." "AWS S3 Bucket" "Storage"
        
            database = container "Database" "Stores user data, news feed data, chat data etc." "PostgreSQL" "Database" {
                platformAccessSchema = component "Platform Access Schema" "SQL Schema"
                newsFeedSchema = component "News Feed Schema" "SQL Schema"
            }
            
            redis = container "Redis" "Stores cache data." "Redis" "Database"
            
        
        # relationships on C1 level
        guest -> krater "Views in read only manner news feed"
        member -> krater "Interact with news feed and other members"
        api -> storage "Saves and reads files using" "REST/HTTPS" 
        krater -> email "Sends email using" "REST/HTTPS"
        
        # relationships on C2 level
        guest -> webApplication "Visits web app using" "HTTPS"
        member -> webApplication "Visits web app using" "HTTPS"
        webApplication -> api "Interacts with api through" "JSON/HTTPS"
        api -> database "Writes and reads data using" "Knex.js/SQL"
        api -> redis "Writes and reads data using" "HTTP Client"
        api -> storage "Saves and reads files using" "REST/HTTPS" 
        api -> email "Sends email using" "REST/HTTPS"
        
        # relationships on C3 level
        webApplication -> server "Makes API calls to" "JSON/HTTPS"
        server -> platformAccess "Loads module and using its controllers" "Module loader"
        server -> following "Loads module and using its controllers" "Module loader"
        server -> messaging "Loads module and using its controllers" "Module loader"
        server -> newsFeed "Loads module and using its controllers" "Module loader"
        server -> postAggregator "Loads module and registers job scheduler" "Module loader"
        server -> profile "Loads module and using its controllers" "Module loader"
        server -> tags "Loads module and using its controllers" "Module loader"
        server -> notifications "Loads module and set up subscribers" "Module Loader"
        
        
        platformAccess -> platformAccessSchema "Store/Retrieve data using" "SQL"
        newsFeed -> newsFeedSchema "Store/Retrieve data using" "SQL"
        
        notifications -> email "Using third-party service to send emails" "REST/HTTP"
        
        newsFeed -> redis
        
        
        
        }
    }
    
    views {
        systemcontext krater "SystemContext" {
            include *
            autoLayout
            animation {
                krater
                guest
                member
            }
        }
        
        container krater "Containers" {
            include *
            autoLayout
        }
        
        component api "Components" {
            include *
            autoLayout
        }
        
        component database "DatabaseComponents" {
            include *
            autoLayout
        }
    
        styles {
            element "Person" {
                shape Person
                background #08427b
                color #ffffff
            }
            
            element "Inner System" {
                background #1168bd
                color #ffffff
            }
            
            element "Web Browser" {
                shape WebBrowser
                background #1168bd
                color #ffffff
            }
            
            element "Database" {
                shape Cylinder
                background #1168bd
                color #ffffff
            }
            
            element "External System" {
                background #999999
                color #ffffff
            }
            
            element "Storage" {
                shape Folder
                background #1168bd
                color #ffffff
            }
        }
    }
}