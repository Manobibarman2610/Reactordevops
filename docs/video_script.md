# REACTOR Video Walkthrough & Script (3-Minute Screen-Recorded Demo)

**Target Duration**: 3 minutes  
**Format**: Screen recording + voiceover  
**Recommended Titles**:
1. "How We Gave Our CI/CD Pipeline Long-Term Memory (Using Hindsight)"
2. "Why CI/CD Forgets Everything — Building an AI DevOps Agent with Memory"
3. "The AI DevOps Engineer That Remembers Every Deployment Failure"
4. "We Stopped Repeating Deployment Outages with Hindsight Agent Memory"
5. "Watch an AI Agent Catch a Production Outage by Recalling Deployment #1"

---

## Script & On-Screen Cues

### Part 1: Quick Intro (0:00 - 0:30)
**[SCREEN CUE: Show REACTOR Live Pipeline Overview showing recent deployments and organizational memory stats]**

**Narration**:  
"Hi, I'm the lead engineer behind **REACTOR: The AI DevOps Engineer That Remembers Every Deployment**. 

If you've ever managed microservices at scale, you know the painful truth: CI/CD checks whether code compiles, but it has zero memory of what actually happened the last time you deployed. When someone upgrades a database driver or modifies a Kubernetes helm chart, teams constantly repeat past failures. 

We built REACTOR to turn every deployment into durable organizational memory that actively prevents the next production failure."

---

### Part 2: The Problem — The Amnesiac Agent (0:30 - 1:00)
**[SCREEN CUE: Click into Deployment #1 in the Deployment History table]**

**Narration**:  
"Here is the problem in action. Take a look at Deployment #1 in our database: an engineer upgraded our PostgreSQL driver `pg` from 8.7 to 8.11. The build passed, but AWS RDS TLS handshake defaults failed in production. The connection pool drained, taking down our checkout API for 40 minutes. 

The team wrote a post-mortem, tuned the pool, and fixed it. But in conventional pipelines, that knowledge lives and dies in an archived incident ticket. 

Weeks later, a developer submits Deployment #27 with another database driver bump. A standard CI pipeline has complete amnesia—it would push it straight to production and crash again."

---

### Part 3: Live Demo — Hindsight Retain and Recall in Action (1:00 - 2:30)
**[SCREEN CUE: Click 'Trigger Deployment #27 (Core Story)' button]**

**Narration**:  
"Watch what happens with REACTOR. I'm triggering Deployment #27 right now.

Notice the architecture flow: 
First, the Event Normalizer parses the diff—it detects the `pg` dependency bump and connection pool edits. 

Now look at the Hindsight Memory call. The agent runs a semantic recall against our Hindsight memory bank: `POST /api/hindsight/recall`. 

Within 280 milliseconds, REACTOR retrieves Deployment #1 with a 92% similarity score! It highlights:
- 'What changed then': pg 8.7 to 8.11
- 'What failed then': Strict TLS handshake pool starvation
- 'What resolved it': Adding the AWS global bundle cert and capping pool clients at 12

Look at the Pre-Flight Verification Checklist generated right here on screen. It doesn't just give a vague warning—it generates the exact OpenSSL command to test the RDS TLS handshake and inspect the pool configuration. 

Now, let's complete the loop. As an engineer, I verify the checklist, execute a safe canary rollout, and submit my feedback: 'Verified fix with AWS cert bundle; zero connection dropouts.' 

I click **Confirm Outcome & Retain Memory**. 

Look at that: REACTOR executes `hindsight.retain()`. The new deployment outcome, the engineer's feedback, and the verified resolution are now permanently forged into organizational memory. 

If we switch to the **Hindsight Memory Explorer** tab, you can see the new memory node added to our live organizational graph with updated association weights."

---

### Part 4: Wrap-Up & Key Takeaway (2:30 - 3:00)
**[SCREEN CUE: Switch to Hindsight Memory Explorer graph showing interconnected memory nodes and banks]**

**Narration**:  
"The biggest takeaway for us was that agent memory shouldn't just be an ephemeral chatbot chat log. By giving our DevOps agent real, structured long-term memory with Hindsight, our CI/CD pipeline doesn't just execute instructions—it learns like a senior staff engineer who remembers every outage and protects the team from repeating them.

Check out the code in our repo and explore Hindsight at `github.com/vectorize-io/hindsight`. Thanks for watching!"
