CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT')
CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED')
CREATE TYPE payment_mode AS ENUM ('UPI', 'CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'NET_BANKING')
CREATE TYPE set_type_enum AS ENUM ('WARMUP', 'NORMAL', 'DROPSET', 'FAILURE')
CREATE TYPE trade_direction AS ENUM ('LONG', 'SHORT')
CREATE TYPE trade_status AS ENUM ('OPEN', 'CLOSED', 'CANCELLED')
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system', 'tool')
CREATE TYPE action_status AS ENUM ('PENDING_CONFIRMATION', 'EXECUTED', 'CANCELLED', 'FAILED')
CREATE TYPE notif_type AS ENUM ('DEADLINE', 'HABIT_REMINDER', 'EXPENSE_ALERT', 'AI_INSIGHT', 'SYSTEM')
CREATE TYPE goal_timeframe AS ENUM ('WEEKLY', 'MONTHLY', 'SEMESTER', 'ANNUAL')

CREATE TABLE users (
	email VARCHAR(255) NOT NULL, 
	hashed_password VARCHAR(255) NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	is_superuser BOOLEAN NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id)
)


CREATE UNIQUE INDEX ix_users_email ON users (email)

CREATE TABLE exercises (
	name VARCHAR(128) NOT NULL, 
	target_muscle_group VARCHAR(64) NOT NULL, 
	equipment VARCHAR(64), 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id)
)


CREATE UNIQUE INDEX ix_exercises_name ON exercises (name)

CREATE TABLE profiles (
	user_id UUID NOT NULL, 
	full_name VARCHAR(128) NOT NULL, 
	college_name VARCHAR(255), 
	engineering_major VARCHAR(128), 
	current_semester INTEGER NOT NULL, 
	target_sleep_hours NUMERIC(3, 1) NOT NULL, 
	monthly_expense_budget NUMERIC(10, 2) NOT NULL, 
	currency VARCHAR(3) NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)



CREATE TABLE projects (
	user_id UUID NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	description TEXT, 
	color_hex VARCHAR(7) NOT NULL, 
	is_completed BOOLEAN NOT NULL, 
	is_deleted BOOLEAN NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)


CREATE INDEX idx_projects_user ON projects (user_id) WHERE NOT is_deleted

CREATE TABLE task_categories (
	user_id UUID NOT NULL, 
	name VARCHAR(64) NOT NULL, 
	icon VARCHAR(32) NOT NULL, 
	color_hex VARCHAR(7) NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)



CREATE TABLE habits (
	user_id UUID NOT NULL, 
	title VARCHAR(128) NOT NULL, 
	description VARCHAR(255), 
	icon VARCHAR(32) NOT NULL, 
	frequency VARCHAR(32) NOT NULL, 
	target_count_per_day INTEGER NOT NULL, 
	current_streak INTEGER NOT NULL, 
	longest_streak INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	is_deleted BOOLEAN NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)


CREATE INDEX idx_habits_user ON habits (user_id) WHERE is_active AND NOT is_deleted

CREATE TABLE expense_categories (
	user_id UUID NOT NULL, 
	name VARCHAR(64) NOT NULL, 
	color_hex VARCHAR(7) NOT NULL, 
	monthly_budget NUMERIC(10, 2), 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)



CREATE TABLE workouts (
	user_id UUID NOT NULL, 
	name VARCHAR(128) NOT NULL, 
	start_time TIMESTAMP WITH TIME ZONE NOT NULL, 
	end_time TIMESTAMP WITH TIME ZONE, 
	duration_minutes INTEGER, 
	notes TEXT, 
	is_deleted BOOLEAN NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)


CREATE INDEX idx_workouts_user_time ON workouts (user_id, start_time DESC)

CREATE TABLE trading_strategies (
	user_id UUID NOT NULL, 
	name VARCHAR(128) NOT NULL, 
	description TEXT, 
	market VARCHAR(64) NOT NULL, 
	timeframe VARCHAR(32) NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)



CREATE TABLE trading_sessions (
	user_id UUID NOT NULL, 
	session_date DATE NOT NULL, 
	total_trades INTEGER NOT NULL, 
	gross_pnl NUMERIC(12, 2) NOT NULL, 
	market_notes TEXT, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)



CREATE TABLE cybersecurity_topics (
	user_id UUID NOT NULL, 
	name VARCHAR(128) NOT NULL, 
	domain VARCHAR(64) NOT NULL, 
	difficulty VARCHAR(32) NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)



CREATE TABLE notes (
	user_id UUID NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	content_markdown TEXT NOT NULL, 
	category VARCHAR(64) NOT NULL, 
	tags VARCHAR(32)[] NOT NULL, 
	is_pinned BOOLEAN NOT NULL, 
	is_deleted BOOLEAN NOT NULL, 
	deleted_at TIMESTAMP WITH TIME ZONE, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)


CREATE INDEX idx_notes_user ON notes (user_id) WHERE NOT is_deleted

CREATE TABLE ai_conversations (
	user_id UUID NOT NULL, 
	title VARCHAR(128) NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)



CREATE TABLE ai_actions (
	user_id UUID NOT NULL, 
	tool_name VARCHAR(64) NOT NULL, 
	arguments_json JSONB NOT NULL, 
	is_destructive BOOLEAN NOT NULL, 
	affected_records_count INTEGER NOT NULL, 
	status action_status NOT NULL, 
	confirmation_token VARCHAR(64), 
	confirmed_at TIMESTAMP WITH TIME ZONE, 
	error_message TEXT, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)


CREATE INDEX idx_ai_actions_user_status ON ai_actions (user_id, status)

CREATE TABLE notifications (
	user_id UUID NOT NULL, 
	title VARCHAR(128) NOT NULL, 
	message VARCHAR(512) NOT NULL, 
	notification_type notif_type NOT NULL, 
	link_url VARCHAR(255), 
	is_read BOOLEAN NOT NULL, 
	read_at TIMESTAMP WITH TIME ZONE, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)


CREATE INDEX idx_notifications_user ON notifications (user_id, is_read, created_at DESC)

CREATE TABLE goals (
	user_id UUID NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	description VARCHAR, 
	category VARCHAR(64) NOT NULL, 
	target_value NUMERIC(10, 2), 
	current_value NUMERIC(10, 2) NOT NULL, 
	unit VARCHAR(32), 
	timeframe goal_timeframe NOT NULL, 
	deadline DATE, 
	is_achieved BOOLEAN NOT NULL, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)



CREATE TABLE tasks (
	user_id UUID NOT NULL, 
	project_id UUID, 
	category_id UUID, 
	title VARCHAR(255) NOT NULL, 
	description TEXT, 
	priority task_priority NOT NULL, 
	status task_status NOT NULL, 
	due_date TIMESTAMP WITH TIME ZONE, 
	estimated_duration_minutes INTEGER, 
	completed_at TIMESTAMP WITH TIME ZONE, 
	tags VARCHAR(32)[] NOT NULL, 
	is_recurring BOOLEAN NOT NULL, 
	recurrence_rule VARCHAR(128), 
	is_deleted BOOLEAN NOT NULL, 
	deleted_at TIMESTAMP WITH TIME ZONE, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
	FOREIGN KEY(project_id) REFERENCES projects (id) ON DELETE SET NULL, 
	FOREIGN KEY(category_id) REFERENCES task_categories (id) ON DELETE SET NULL
)


CREATE INDEX idx_tasks_due_date ON tasks (user_id, due_date) WHERE status != 'DONE' AND NOT is_deleted
CREATE INDEX idx_tasks_user_status ON tasks (user_id, status) WHERE NOT is_deleted

CREATE TABLE habit_logs (
	habit_id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	log_date DATE NOT NULL, 
	completion_count INTEGER NOT NULL, 
	notes VARCHAR(255), 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_habit_date UNIQUE (habit_id, log_date), 
	FOREIGN KEY(habit_id) REFERENCES habits (id) ON DELETE CASCADE, 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)


CREATE INDEX idx_habit_logs_date ON habit_logs (user_id, log_date)

CREATE TABLE expenses (
	user_id UUID NOT NULL, 
	category_id UUID, 
	amount NUMERIC(10, 2) NOT NULL, 
	currency VARCHAR(3) NOT NULL, 
	description VARCHAR(255) NOT NULL, 
	expense_date DATE NOT NULL, 
	payment_method payment_mode NOT NULL, 
	notes TEXT, 
	is_deleted BOOLEAN NOT NULL, 
	deleted_at TIMESTAMP WITH TIME ZONE, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
	FOREIGN KEY(category_id) REFERENCES expense_categories (id) ON DELETE SET NULL
)


CREATE INDEX idx_expenses_user_date ON expenses (user_id, expense_date) WHERE NOT is_deleted

CREATE TABLE workout_sets (
	workout_id UUID NOT NULL, 
	exercise_id UUID NOT NULL, 
	set_number INTEGER NOT NULL, 
	weight_kg NUMERIC(6, 2) NOT NULL, 
	repetitions INTEGER NOT NULL, 
	set_type set_type_enum NOT NULL, 
	rpe NUMERIC(3, 1), 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(workout_id) REFERENCES workouts (id) ON DELETE CASCADE, 
	FOREIGN KEY(exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
)


CREATE INDEX ix_workout_sets_workout_id ON workout_sets (workout_id)

CREATE TABLE trades (
	user_id UUID NOT NULL, 
	session_id UUID, 
	strategy_id UUID, 
	ticker VARCHAR(32) NOT NULL, 
	direction trade_direction NOT NULL, 
	quantity INTEGER NOT NULL, 
	entry_price NUMERIC(12, 2) NOT NULL, 
	stop_loss NUMERIC(12, 2) NOT NULL, 
	target_price NUMERIC(12, 2) NOT NULL, 
	exit_price NUMERIC(12, 2), 
	pnl NUMERIC(12, 2), 
	status trade_status NOT NULL, 
	chart_image_url VARCHAR(512), 
	psychology_notes TEXT, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
	FOREIGN KEY(session_id) REFERENCES trading_sessions (id) ON DELETE SET NULL, 
	FOREIGN KEY(strategy_id) REFERENCES trading_strategies (id) ON DELETE SET NULL
)


CREATE INDEX idx_trades_user_ticker ON trades (user_id, ticker)

CREATE TABLE learning_sessions (
	user_id UUID NOT NULL, 
	topic_id UUID, 
	platform VARCHAR(64) NOT NULL, 
	session_title VARCHAR(255) NOT NULL, 
	duration_minutes INTEGER NOT NULL, 
	flags_captured INTEGER NOT NULL, 
	notes_markdown TEXT, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
	FOREIGN KEY(topic_id) REFERENCES cybersecurity_topics (id) ON DELETE SET NULL
)


CREATE INDEX idx_learning_sessions_user ON learning_sessions (user_id, created_at DESC)

CREATE TABLE ai_messages (
	conversation_id UUID NOT NULL, 
	role message_role NOT NULL, 
	content TEXT NOT NULL, 
	tool_call_id VARCHAR(64), 
	tool_name VARCHAR(64), 
	tokens_used INTEGER, 
	id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(conversation_id) REFERENCES ai_conversations (id) ON DELETE CASCADE
)


CREATE INDEX idx_ai_messages_conv ON ai_messages (conversation_id, created_at)
