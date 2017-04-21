defmodule PFA.CardController do
  use PFA.Web, :controller

  alias PFA.Repo
  alias PFA.Card

  def index(conn, _params) do
    render conn, "index.html"
  end

  def show(conn, %{ "card_url" => url }) do
    case Repo.get_by(Card, url: url) do
      nil  -> conn |> render("404.html")
      card ->
        card = Repo.preload card, :projects
        conn
        |> render("show.html", card: card)
    end
  end
end
