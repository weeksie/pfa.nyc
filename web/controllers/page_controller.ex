defmodule PFA.PageController do
  use PFA.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  # these Markdown content pages could be abstracted and cached if it were necessary
  def about(conn, _params) do
    content = File.read! "web/static/markdown/about.md"
    conn
    |> render "about.html", content: content
  end
  
  def how_does_it_work(conn, _params) do
    content = File.read! "web/static/markdown/how-does-it-work.md"
    conn
    |> render "about.html", content: content
  end
end
