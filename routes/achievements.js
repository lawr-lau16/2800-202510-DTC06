// Import necessary modules and set up router instance
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import Mongoose models for achievements and users
const achievements = mongoose.model("achievements");
const users = mongoose.model("users");


// ACHIEVEMENTS PAGE
/**
 * Here the server will recognise that the server is requested with the /achievements URL and will render the achievements file.
 * The server will also serve the user's achievements to the page in json format.
 * If the user is not logged in, they will be redirected to the login page.
 */
router.get("/", async (req, res) => {
  if (!req.session.uid) return res.redirect("/login");

  try {
    // Retrieve the logged-in user from the database
    const user = await users.findById(req.session.uid);

    // Find all active achievements based on IDs in the user's record
    const activeAchievements = await achievements.find({
      _id: { $in: user.activeAchievements },
    });

    // Find all inactive achievements similarly
    const inactiveAchievements = await achievements.find({
      _id: { $in: user.inactiveAchievements },
    });

    // Render the achievements page and pass user data and achievements
    res.render("achievements", {
      user,
      activeAchievements,
      inactiveAchievements,
    });
  } catch (err) {
    // Log error and return a 500 Internal Server Error response
    console.error("Error loading achievements:", err);
    res.status(500).send("Server error");
  }
});


// Route to get achievement data
router.get("/data", async (req, res) => {
  // Ensure user is authenticated
  if (!req.session.uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await users.findById(req.session.uid);

  // Fetch active and inactive achievements from DB using IDs stored in user record
  const allActive = await Promise.all(user.activeAchievements.map(id => achievements.findById(id)));
  const allInactive = await Promise.all(user.inactiveAchievements.map(id => achievements.findById(id)));

  // Filter to only include incomplete achievements from active list
  const active = allActive.filter(a => a && !a.completed);
  // Filter to include only completed achievements from the active list
  const completedFromActive = allActive.filter(a => a && a.completed);

  // Collect IDs of achievements that are already known
  const knownIds = new Set([
    ...user.activeAchievements.map(id => id.toString()),
    ...user.inactiveAchievements.map(id => id.toString()),
  ]);

  // Fetch additional completed achievements NOT tracked in active/inactive
  const extraCompleted = await achievements.find({
    completed: true,
    userId: user._id,
    _id: { $nin: Array.from(knownIds) }
  });

  // Merge the two sources of completed achievements
  const completed = [...completedFromActive, ...extraCompleted];

  // Reset joke session variable
  req.session.joke = "";

  // Send structured JSON containing categorized achievements
  res.json({
    active,
    // remove any nulls from DB misses
    inactive: allInactive.filter(Boolean),
    completed
  });
});


/**
 * Fetches the users achievements from the database, along with their user information.
 * Uses the user's ID stored in the session to find the user in the database where the achievements are stored.
 * The achievements are identified and delivered to the view.
 * The user information is also delivered to the view.
 */
router.post("/", async (request, result) => {
  try {
    // Ensure user is authenticated
    if (!request.session.uid) {
      return result.redirect("/login");
    }

    // Find the user by their session ID
    const user = await users.findById(request.session.uid);

    // Retrieve all achievements associated with this user
    const userAchievements = await achievements.find({
      _id: { $in: user.achievements },
    });

    // Log the retrieved data for debugging purposes
    console.log("Fetched Achievements:", userAchievements);

    // Send the user data and their achievements back as JSON
    result.json({ achievements: userAchievements, user: user });
  } catch (err) {
    // Log and respond with server error if something goes wrong
    console.log("Error fetching achievements:", err.message);
    result.status(500).json({ error: "Internal server error" });
  }
});


/**
 * Updates the achievement that is passed by the script in the view.
 * The achievement is identified by its ID and the new data is passed to the database.
 * The achievement is updated in the database, with the new progress, completed and date and previousDate values.
 */
router.post("/update", async (request, result) => {
  try {
    // Ensure user is authenticated
    if (!request.session.uid) {
      return result.redirect("/login");
    }

    // Extract fields from request body
    const achievementId = request.body.achievementId;
    const progress = request.body.progress;
    const completed = request.body.completed;
    const date = new Date(request.body.date);
    /**
     * This is used to set the date to the correct timezone.
     * Without this, the date will be set to UTC time.
     * Generated by ChatGPT -4o
     *
     * @author https://chat.openai.com/
     */
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    const previousDate = new Date(request.body.previousDate);
    /**
     * This is used to set the date to the correct timezone.
     * Without this, the date will be set to UTC time.
     * Generated by ChatGPT -4o
     *
     * @author https://chat.openai.com/
     */
    previousDate.setMinutes(
      previousDate.getMinutes() + previousDate.getTimezoneOffset()
    );
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    // Update the specified achievement in the database
    await achievements.findByIdAndUpdate(achievementId, {
      progress,
      completed,
      date,
      previousDate,
    });

    console.log("Updated Achievement:", achievementId);
    result.json({ message: "Achievement updated successfully" });
  } catch (err) {
    // Handle errors gracefully
    console.log("Error updating achievement:", err.message);
    result.status(500).json({ error: "Internal server error" });
  }
});


/**
 * Replace's an achievement with a new one.
 * The new achievement is created from the mongoDB achievements model, and populated with the new data passed to the server.
 * The new achievement is saved to the database and the user's achievements array.
 * The old achievement is deleted, and its id removed from user's achievements array, and the reward is returned to the view.
 */
router.post("/replace", async (request, result) => {
  try {
    if (!request.session.uid) {
      return result.redirect("/login");
    }
    const type = request.body.type;
    const description = request.body.description;
    const progress = request.body.progress;
    const target = request.body.target;
    const date = new Date(request.body.date);
    /**
     * This is used to set the date to the correct timezone.
     * Without this, the date will be set to UTC time.
     * Generated by ChatGPT -4o
     *
     * @author https://chat.openai.com/
     */
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    const previousDate = new Date(request.body.previousDate);
    /**
     * This is used to set the date to the correct timezone.
     * Without this, the date will be set to UTC time.
     * Generated by ChatGPT -4o
     *
     * @author https://chat.openai.com/
     */
    previousDate.setMinutes(
      previousDate.getMinutes() + previousDate.getTimezoneOffset()
    );
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    const completed = request.body.completed;
    const reward = request.body.reward;
    const oldID = request.body.oldID;
    const newAchievement = new achievements({
      userId: request.session.uid,
      type,
      description,
      progress,
      target,
      date,
      previousDate,
      completed,
      reward,
    });
    await newAchievement.save();

    // Add new achievement to user's list
    await users.findByIdAndUpdate(request.session.uid, {
      $push: { achievements: newAchievement._id },
    });

    // Find and delete old achievement
    const oldReward = await achievements.findById(oldID);
    await achievements.findByIdAndDelete(oldID);

    // Remove old achievement from user's record
    await users.findByIdAndUpdate(request.session.uid, {
      $pull: { achievements: oldID },
    });
    console.log("Replaced and achievement with:", newAchievement);

    // Respond with the reward of the old achievement
    result.json({ reward: oldReward.reward });
  } catch (err) {

    // Log and return server error on failure
    console.log("Error replacing achievement:", err.message);
    result.status(500).json({ error: "Internal server error" });
  }
});


router.post("/activate", async (req, res) => {
  // Ensure user is logged in
  if (!req.session.uid) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.body;

  try {
    // Retrieve the logged-in user
    const user = await users.findById(req.session.uid);

    // Enforce maximum of 4 active achievements
    if (user.activeAchievements.length >= 4) {
      return res.status(400).json({ error: "You can only have 4 active achievements." });
    }

    // Check if achievement exists in inactiveAchievements (make sure users can't double click quickly)
    const index = user.inactiveAchievements.indexOf(id);
    if (index === -1) {
      return res.status(404).json({ error: "Achievement not found in inactive list." });
    }

    // Move it from inactive to active
    user.inactiveAchievements.splice(index, 1);
    user.activeAchievements.push(id);
    await user.save();

    // Track "add_achievement" progress for "Select an inactive achievement" achievement
    const addAchievement = await achievements.findOne({
      _id: { $in: user.activeAchievements },
      type: "add_achievement",
      completed: false,
    });

    // If the 'add_achievement' achievement type exists for the user, and it hasn’t reached its target yet, then increase its progress by 1
    if (addAchievement && addAchievement.progress < addAchievement.target) {
      addAchievement.progress += 1;
      await addAchievement.save();
    }

    res.json({ success: true });
  } catch (err) {

    // Handle unexpected errors
    console.error("Error activating achievement:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Ensure user is authenticated
router.get("/templates", async (req, res) => {
  if (!req.session.uid) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Fetch all achievement templates from the database
    const templates = await achievementTemplates.find({});

    // Return the templates in JSON format
    res.json({ templates });
  } catch (err) {

    // Log and return error if fetch fails
    console.error("Error fetching templates:", err.message);
    res.status(500).json({ error: "Failed to load templates" });
  }
});


// Route to redeem achievement
router.post("/redeem", async (req, res) => {
  // Check if user is authenticated
  if (!req.session.uid) {
    return result.redirect("/login");
  }
  const { id } = req.body;

  try {
    // Fetch user and the achievement to be redeemed
    const user = await users.findById(req.session.uid);
    const achievement = await achievements.findById(id);

    // Handle case where achievement doesn't exist
    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    // Associate the achievement with the user if it isn't already
    if (!achievement.userId) {
      achievement.userId = req.session.uid;
    }

    // Set achievement as completed
    achievement.completed = true;
    await achievement.save();

    // Remove redeemed achievement from activeAchievements
    user.activeAchievements = user.activeAchievements.filter(aid =>
      aid && aid.toString() !== achievement._id.toString()
    );

    // Add reward to user coins balance
    user.coins += achievement.reward;
    await user.save();

    // Respond with the reward amount
    res.json({ reward: achievement.reward });
  } catch (err) {

    // Log and respond to any server errors
    console.error("Error redeeming achievement:", err.message);
    res.status(500).json({ error: "Could not redeem reward" });
  }
});


// Check if the user stayed within their weekly budget over the last 7 days (starting from when 'weekly_budget' achievement was activated)
router.post("/track-weekly-budget", async (req, res) => {
  // Check if user is authenticated
  if (!req.session.uid) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Fetch user and their active 'weekly_budget' achievement
    const user = await users.findById(req.session.uid);
    const achievement = await achievements.findOne({
      _id: { $in: user.activeAchievements },
      type: "weekly_budget",
      completed: false,
    });

    // Stop if user does not have this achievement
    if (!achievement) {
      return res.json({ success: false, message: "No active weekly budget achievement." });
    }

    // Define the 7-day date range
    const start = new Date(achievement.date);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    end.setHours(23, 59, 59, 999);

    // Retrieve all user expenses within that period
    const expenses = await mongoose.model("transactions").find({
      _id: { $in: user.transactions },
      type: "expense",
      date: { $gte: start, $lte: end },
    });

    // Calculate total amount from 7 day period
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

    // If the total spent is within budget, increment progress
    if (totalSpent <= user.budget.weekly && user.budget.weekly > 0) {
      if (achievement.progress < achievement.target) {
        achievement.progress += 1;
        await achievement.save();
        return res.json({ success: true, message: "Weekly budget goal achieved!" });
      }
    }

    // Budget not met or already at target
    res.json({ success: false, message: "Weekly budget goal not met yet." });
  } catch (err) {
    // Handle server errors
    console.error("Error tracking weekly budget:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Check if the user stayed within their weekly budget over the last 7 days (starting from when 'weekly_budget' achievement was activated)
router.post("/track-monthly-budget", async (req, res) => {
    // Check if user is authenticated
  if (!req.session.uid) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Retrieve user and their active monthly budget achievement
    const user = await users.findById(req.session.uid);
    const achievement = await achievements.findOne({
      _id: { $in: user.activeAchievements },
      type: "monthly_budget",
      completed: false,
    });

    // Stop if user does not have this achievement
    if (!achievement) {
      return res.json({ success: false, message: "No active monthly budget achievement." });
    }

    // Define a 30-day period from the achievement's start date
    const start = new Date(achievement.date);
    const end = new Date(start);
    end.setDate(start.getDate() + 30);
    end.setHours(23, 59, 59, 999);

    // Fetch all user expenses during this period
    const expenses = await mongoose.model("transactions").find({
      _id: { $in: user.transactions },
      type: "expense",
      date: { $gte: start, $lte: end },
    });

    // Calculate total amount from 30 day period
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

    // If user spent <= their monthly budget (and their budget is set > 0)
    if (totalSpent <= user.budget.monthly && user.budget.monthly > 0) {
      if (achievement.progress < achievement.target) {
        achievement.progress += 1;
        await achievement.save();
        return res.json({ success: true, message: "Monthly budget goal achieved!" });
      }
    }

    res.json({ success: false, message: "Monthly budget goal not met yet." });
  } catch (err) {
    // Handle server-side error
    console.error("Error tracking monthly budget:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Check if the user has any expenses named coffee for coffee achievement
router.post("/track-coffee", async (req, res) => {
  // Check if user is authenticated
  if (!req.session.uid) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Get the user and their active, incomplete "coffee" achievement
    const user = await users.findById(req.session.uid);
    const achievement = await achievements.findOne({
      _id: { $in: user.activeAchievements },
      type: "coffee",
      completed: false,
    });

    // Stop if user does not have this achievement
    if (!achievement) {
      return res.json({ success: false, message: "No active coffee achievement." });
    }

    // Get start date
    const now = new Date();
    // Get date last checked for achievement
    const lastCheck = new Date(achievement.previousDate);
    // Check if it's a new day
    const isNewDay =
      now.getFullYear() !== lastCheck.getFullYear() ||
      now.getMonth() !== lastCheck.getMonth() ||
      now.getDate() !== lastCheck.getDate();

    // Skip if already checked today
    if (!isNewDay) {
      return res.json({ success: false, message: "Already checked today." });
    }

    // Set up time range for day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Search for any expense with name 'coffee'
    const coffeeExpense = await mongoose.model("transactions").findOne({
      _id: { $in: user.transactions },
      type: "expense",
      // Case insensitive
      name: /coffee/i,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    console.log("why?", coffeeExpense);

    // If no coffee was bought today and the achievement is not done yet
    if (!coffeeExpense && achievement.progress < achievement.target) {
      // Increment progress
      achievement.progress += 1;
      // Set today as last checked date
      achievement.previousDate = now;
      await achievement.save();

      return res.json({ success: true, message: "Day counted, no coffee purchased!" });

      // If coffee was bought today, don't increment progress
    } else if (coffeeExpense) {
      // Set today as last checked date
      achievement.previousDate = now;
      await achievement.save();

      return res.json({ success: false, message: "You bought coffee today!" });
    }

    // If nothing changed
    res.json({ success: false, message: "No progress made." });
  } catch (err) {
    // Error handling
    console.error("Error tracking coffee achievement:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;