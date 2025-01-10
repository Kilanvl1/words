ALTER TABLE "word" ADD COLUMN IF NOT EXISTS "scheduled_update_time" timestamp;

-- Create a function to update expired states
  CREATE OR REPLACE FUNCTION update_word_states()
  RETURNS void AS $$
  BEGIN
      UPDATE word
      SET state_of_word = 'learning',
          scheduled_update_time = NULL
      WHERE state_of_word = 'refresh_tomorrow'
      AND scheduled_update_time <= CURRENT_TIMESTAMP;
  END;
  $$ LANGUAGE plpgsql;

-- Create the trigger function
  CREATE OR REPLACE FUNCTION set_scheduled_update_time()
  RETURNS TRIGGER AS $$
  BEGIN
      IF NEW.state_of_word = 'refresh_tomorrow' THEN
          NEW.scheduled_update_time = CURRENT_TIMESTAMP + INTERVAL '24 hours';
      END IF;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create the trigger
  CREATE OR REPLACE TRIGGER trigger_set_scheduled_update_time
      BEFORE INSERT OR UPDATE ON word
      FOR EACH ROW
      EXECUTE FUNCTION set_scheduled_update_time();


