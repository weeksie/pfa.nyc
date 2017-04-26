# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :pfa,
  ecto_repos: [PFA.Repo]

# Configures the endpoint
config :pfa, PFA.Endpoint,
  http: [port: { :system, "PORT" }],
  url: [host: "0.0.0.0", port: 80],
  secret_key_base: "7w9mb2ly002WhDcD7yZlBIRORslkhzilRksyPsCFKDKlldsI4zRwx3MAseTfoiCT",
  render_errors: [view: PFA.ErrorView, accepts: ~w(html json)],
  pubsub: [name: PFA.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Slime
config :phoenix, :template_engines,
  slim: Phoenix.Slime.Engine, slime: PhoenixSlime.Engine

config :slime, :embedded_engines, %{
  markdown: PFA.MarkdownEngine
}

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
