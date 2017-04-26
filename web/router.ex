defmodule PFA.Router do
  use PFA.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", PFA do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/services/:card_url", CardController, :show
    get "/services", CardController, :index
    get "/projects", ProjectController, :index
    get "/:url", PageController, :show
  end

  # Other scopes may use custom stacks.
  # scope "/api", PFA do
  #   pipe_through :api
  # end
end
