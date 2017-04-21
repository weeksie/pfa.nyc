# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     PFA.Repo.insert!(%PFA.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias PFA.Repo
alias PFA.Project
alias PFA.Card

# Testimonials
#  * Emmett Shine
#  * Dmitri Vasiliev
{ :ok, sweetgreen } = Repo.insert %Project{
  name: "Sweetgreen",
  url: "https://order.sweetgreen.com",
  image: "sweetgreen.png",
  description: """
The Sweetgreeen ordering application was a sweeping project. The application consisted of the following components:

* An Ember application for front end ordering
* A Rails API server to the back end ordering, payment, and loyalty programs
* A Rails CMS

When I was consulting with Gin Lane, I lead the project development, focusing on the back end stack. We took great pains to keep tight iteration cycles with the design and product teams, ensuring that each teams' vision of the project did not diverge.

The end result was a product launched on time to the great delight of the client.
"""
}

# Testimonials
#  * Emmett Shine
#  * Dmitri Vasiliev
{ :ok, reformation } = Repo.insert %Project{
  name: "The Reformation",
  url: "https://www.thereformation.com",
  image: "reformation.png",
  description: """
My first project consulting with [Gin Lane](https://ginlane.com) was to build out an ecommerce solution for The Reformation. This website might be the very first ecom React JS front end to hit production. It was launched in the spring of 2014. I led both the front end and the server side development. This included an in depth customization of the Spree ecommerce platform.
"""
}

# Testimonials:
#  * Joe Schick
#  * Art Nikaj
{ :ok, webmd } = Repo.insert %Project{
  name: "WebMD Video Player",
  url: "https://webmd.com",
  image: "webmd.png",
  description: """
WebMD and its professional arm, Medscape, had been trying to build out a new video player for their education department for years. The old codebase had a tremendous amount of legacy code that made the task difficult ranging on impossible. I came in and introduced React and Redux as a nice way to juggle all of the many demands on the video player from other parts of the business. Key points:

* Introduced React to the team at WebMD which demanded the usual consultomancy around juggling the usefulness of new technology and introducing in a way that did not disrupt the vital workflows of the team.
* Mentored developers, helping them to get up to speed with a new stack
* Communicated with the various departments to coordinate integration with enormous back end systems
"""
}

# testimonials:
#  * Jose Arenado
#  * Rodney Woodruff
{ :ok, gucci } = Repo.insert %Project{
  name: "Gucci",
  url: "https://www.gucci.com",
  image: "gucci.png",
  description: """
Gucci USA rebuilt its old ecommerce system in Rails back in 2009-2010. As a senior consultant, I architected the integrations with the AS400 driven back of house inventory and billing systems as well as the custom CMS for buyers. This was a massive Rails project, especially for the time period.
"""
}

# testimonials
#  * Ben Moir
{ :ok, gotcha } = Repo.insert %Project{
  name: "Gotcha",
  url: "http://www.snepo.com/articles/20-gotcha-gps-based-mobile-game",
  image: "gotcha.png",
  description: """
My old company, Snepo, contacted me with an emergency: their groundbreaking mobile game _Gotcha_ was about to launch and the performance just wasn't cutting it. This was an acute case of project rescue and I dove in head first, pulling apart the server code, optimizing away until I achieved _1000x_ performance improvement. The game was launched the next day to great success.
"""
}


# testimonials
#  * Ian Rogers
#  * Jeff Berg
{ :ok, agitate } = Repo.insert %Project{
  name: "Agitate",
  url: "https://agitate.herokuapp.com",
  image: "agitate.png",
  description: """
Agitate is a civic data project that sprung out of frustration with partisan [gerrymandering](https://en.wikipedia.org/wiki/Gerrymandering). Collecting and collating data from various government agencies, including the census bureau, I came up with a score for each congressional district.

I then integrated Leaflet with React and Redux for the front end. Built out a GraphQL API using Absinthe for Phoenix and got to work whipping the TIGER/LINE files and election histories into shape. At the time of publication the project is still underway. It is open source and can be viewed on [github](https://github.com/weeksie/agitate)

"""
}


################################################################################
# cards

Repo.insert! %Card{
  name: "Javascript Development",
  url: "javascript-project",
  projects: [
    reformation,
    sweetgreen,
    webmd
  ],
  description: """
You have a Javascript project and that's awesome. I love those.

I hope you're using React. I'd be even more excited if you are using Redux to handle the state of your application. Since it was released in 2014 I had an intuitive affinity for React as a framework. Back in the early aughts I built some large projects in Haskell, which is a very academic, _very_ functional language. Imagine my delight all these years later as the mainstream begins to learn what the nerds have been preaching for the last 20 years.

Needless to say, I'm overjoyed at the changes that have happened with Javascript, both the language and the supporting frameworks. NPM might still be a ghetto, but it's a far cry from the Internet Dark Ages. Contact me and let's talk about your project.
"""
}


Repo.insert! %Card{
  name: "Elixir Development",
  url: "elixir-project",
  projects: [
    agitate
  ],
  description: """
Elixir! Oh man. I have fallen just a little bit in love with it.

Back when the earth's crust was still cooling (the early '00s), I built a massively parallel video encoding platform in Erlang. The language itself was not my favorite, but the platform and the semantics left a deep impression on me. Even to the point where I went as far as writing a toy VM for an Erlang-like language with Ruby-like syntax.

Well ten years later Elixir pops its head out of the closet. Like when React was announced, I knew immediately that it would catch on. We're on the verge of a sea change as old Ruby/Rails heads shift toward the Elixir/Phoenix platform for building web applications and I couldn't be happier.

If you're considering Elixir for a project or have one underway I want to talk to you. You're either fearless, some kind of maniac, or a genius. I'll take any of those.
"""
}


Repo.insert! %Card{
  name: "Rails Development",
  url: "rails-project",
  projects: [
    sweetgreen,
    gucci,
    gotcha,
    reformation
  ],
  description: """
Rails, rails, rails.

Ruby was my first love. Imagine a time when Rails didn't exist. Go further. Imagine when there were so few people using Ruby that we had to team up with the Smalltalk fans in order to have a meetup group big enough to reserve a table at a bar. Back then, rubyists who wanted to build web applications frequently rolled their own application servers from scratch. Oh what innocent, bygone days.

Needless to say, when the Rails announcement hit, I was a very happy person. I had no idea how big the effect would be. However, I've been using Rails in production since about three weeks after it was announced. To this day, if you want a great out of the box web experience it's impossible to beat. Ruby is still the beautiful language I fell for fifteen years ago and it delights me every day.

If you have a Rails project, get in touch. It's my hometown.
"""
}


Repo.insert! %Card{
  name: "Leadership",
  url: "project-lead",
  projects: [
    sweetgreen,
    reformation,
    webmd
  ],
  description: """
Nothing I love more than meeting a team of smart developers.

Sometimes all that raw talent needs some nurturing. Talent gets you a lot but out of the box it doesn't get you use of version control, project estimation and tracking, SCRUM/Kanban boards, unit testing, and so on.

That stuff is hard to get just right because the right way to run a dev team depends a lot on the team itself. Big-M methodology books sell well but run poorly they can be worse than nothing at all.

I have a lot of experience growing developers. It's a gentle art, since devs don't respond to top down authority. It's also rewarding as hell to see people that I've worked with go on to become amazing professionals.

If you have a team, old or young, that could use some leadership and mentoring, I'd love to talk further. This is one of my passions.
"""
}


# Repo.insert! %Card{
#   name: "Code Auditing",
#   url: "code-audit",
#   projects: [

#   ],
#   description: """

# """
# }

Repo.insert! %Card{
  name: "Project Rescue",
  url: "project-rescue",
  projects: [
    gotcha
  ],
  description: """
About to launch and you can't figure out why your ping time is 500ms? Sweating bullets because the dev team told you that they'd be ready to go any day now, but you've blown your last five deadlines?

I won't magically finish your project in a weekend. What I will do is give a clear eyed assessment of what needs to change and a roadmap to getting the project back on track in the most practical way possible.
"""
}
