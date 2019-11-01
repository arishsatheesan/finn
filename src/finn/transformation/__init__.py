"""
Guide to writing FINN transformations
-------------------------------------

* Your transformation should take in a ModelWrapper, and return a tuple with
 (transformed_model: ModelWrapper, model_was_changed: Bool)
* The transformations are meant to be applied using the .transform functions
  in ModelWrapper. This makes a deep copy of the input model by default, so
  you don't have to.
* model_was_changed indicates whether your transformation made any changes to
  the model. If you know your transformation needs to be called only once and
  repeated calls have no further effect, you can return False even if the model
  was changed.
* You MUST return model_was_changed=False at some point when your transformation
  is called multiple times, otherwise apply_repeated() will loop infinitely.
* If you cannot guarantee that the transformation will reach a fixed point,
  you must declare this and notify the user to use .transform_single() instead
  of .transform_repeated()
"""
