defmodule PFA.PageController do
  use PFA.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def about(conn, _params) do
    content = File.read! "web/static/markdown/about.md"
    conn
    |> render "about.html", content: content
  end
end
