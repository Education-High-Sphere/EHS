import progressService from "../../services/progress/progressService.js";

const ProgressController = {
  async completeLesson(req, res) {
    try {
      const { lessonId } = req.body;
      const userId = res.locals.user.id;

      if (!lessonId) {
        return res.status(400).json({ message: "Lesson ID is required." });
      }

      const result = await progressService.completeLesson(userId, lessonId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error completing lesson:", error.message);
      res.status(500).json({ message: "Error updating progress." });
    }
  },

  async getProgress(req, res) {
    try {
      const { courseId } = req.params;
      const userId = res.locals.user.id;

      const completedLessons = await progressService.getCourseProgress(userId, courseId);
      res.status(200).json({ completedLessons });
    } catch (error) {
      console.error("Error getting progress:", error.message);
      res.status(500).json({ message: "Error fetching progress." });
    }
  }
};

export default ProgressController;
