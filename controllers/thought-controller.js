const { User, Thought } = require("../models");

const thoughtController = {
  //GET all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((error) => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  //GET thought by ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
    .select('-__v')
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this ID" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  // POST new thought
  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this ID" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((error) => res.json(error));
  },
  //PUT update thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this ID" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((error) => res.status(400).json(error));
  },
  //Delete thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
        .then(deletedThought => {
            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought with this ID' });
            }
            return User.findOneAndUpdate(
                { username: deletedThought.username },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this ID' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(error => res.json(error));
},
  //POST reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this ID" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((error) => res.json(error));
  },
  //Delete reaction
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true, runValidators:true }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((error) => res.json(error));
  },
};

module.exports = thoughtController;
