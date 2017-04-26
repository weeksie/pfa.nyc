defmodule PFA.CardController do
  use PFA.Web, :controller

  alias PFA.Repo
  alias PFA.Card
  alias PFA.Testimonial

  def index(conn, _params) do
    cards        = Repo.all Card
    testimonials = Testimonial.shuffle()
    padding      = pad length(cards) - length(testimonials)
    render conn, "index.html", cards: cards, testimonials: testimonials ++ padding
  end

  def show(conn, %{ "card_url" => url }) do
    case Repo.get_by(Card, url: url) do
      nil  -> conn |> render("404.html")
      card ->
        card         = Repo.preload card, :projects
        conn
        |> render("show.html", card: card, testimonial: Testimonial.random())
    end
  end

  defp pad(len) do
    if len <= 0 do
      []
    else
      list = Enum.to_list 0..len
      Enum.map list, fn _ -> nil end
    end
  end
end
